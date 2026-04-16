const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000
const UPLOAD_DIR = path.join(__dirname, 'uploads-rs-pelita')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rs_pelita_cms',
  waitForConnections: true,
  connectionLimit: 10,
})

async function ensureFacilitiesImageColumn() {
  const dbName = process.env.DB_NAME || 'rs_pelita_cms'
  const [rows] = await pool.query(
    `
      SELECT 1
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'facilities'
        AND COLUMN_NAME = 'image_path'
      LIMIT 1
    `,
    [dbName],
  )

  if (rows.length === 0) {
    await pool.query('ALTER TABLE facilities ADD COLUMN image_path VARCHAR(255) NULL')
  }
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: false,
  }),
)
app.use(express.json())
app.use(
  '/uploads-rs-pelita',
  express.static(UPLOAD_DIR, { maxAge: '1d', index: false }),
)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext)
    const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, '_')
    cb(null, `${Date.now()}-${safeBase}${ext}`)
  },
})

const upload = multer({ storage })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rspelita.local'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const JWT_SECRET = process.env.JWT_SECRET || 'rs-pelita-secret'

function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' })
    return res.json({ token })
  }
  return res.status(401).json({ message: 'Email atau password salah' })
})

async function getContentBlock(slug) {
  const [rows] = await pool.query('SELECT * FROM content_blocks WHERE slug = ? LIMIT 1', [slug])
  if (rows.length === 0) {
    return null
  }
  const row = rows[0]
  let extra = {}
  try {
    extra = row.extra_json ? JSON.parse(row.extra_json) : {}
  } catch {
    extra = {}
  }
  return {
    slug: row.slug,
    title: row.title,
    body: row.body,
    ...extra,
  }
}

async function upsertContentBlock(slug, { title = null, body = null, ...extra }) {
  const extraJson = JSON.stringify(extra)
  await pool.query(
    `
      INSERT INTO content_blocks (slug, title, body, extra_json)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        body = VALUES(body),
        extra_json = VALUES(extra_json)
    `,
    [slug, title, body, extraJson],
  )
}

app.get('/api/content/home', async (req, res) => {
  try {
    const block = (await getContentBlock('home')) || {}
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const heroBannerImageUrl = block.hero_banner_image
      ? `${baseUrl}/uploads-rs-pelita/${block.hero_banner_image}`
      : null
    const heroFeatureImageUrl = block.hero_feature_image
      ? `${baseUrl}/uploads-rs-pelita/${block.hero_feature_image}`
      : null

    const hero = {
      title: block.hero?.title || block.title || 'RS Pelita',
      subtitle:
        block.hero?.subtitle ||
        block.body ||
        'Placeholder subjudul. Perbarui melalui pengaturan konten di dashboard admin.',
      hero_banner_image: heroBannerImageUrl,
      hero_feature_image: heroFeatureImageUrl,
    }

    const stats = block.stats || null
    res.json({ hero, stats })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil konten home' })
  }
})

app.put('/api/content/home', authenticate, async (req, res) => {
  try {
    const payload = req.body || {}
    await upsertContentBlock('home', {
      title: payload.hero?.title || null,
      body: payload.hero?.subtitle || null,
      hero: payload.hero || null,
      stats: payload.stats || null,
    })
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menyimpan konten home' })
  }
})

app.put(
  '/api/content/home/images',
  authenticate,
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'feature', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files || {}
      const bannerFile = Array.isArray(files.banner) && files.banner[0] ? files.banner[0] : null
      const featureFile =
        Array.isArray(files.feature) && files.feature[0] ? files.feature[0] : null

      if (!bannerFile && !featureFile) {
        return res.status(400).json({ message: 'Tidak ada file gambar yang dikirim.' })
      }

      const [rows] = await pool.query(
        'SELECT title, body, extra_json FROM content_blocks WHERE slug = ? LIMIT 1',
        ['home'],
      )

      let title = null
      let body = null
      let extra = {}

      if (rows.length > 0) {
        title = rows[0].title
        body = rows[0].body
        try {
          extra = rows[0].extra_json ? JSON.parse(rows[0].extra_json) : {}
        } catch {
          extra = {}
        }
      }

      const oldBannerFilename = extra.hero_banner_image || null
      const oldFeatureFilename = extra.hero_feature_image || null

      if (bannerFile) {
        extra.hero_banner_image = bannerFile.filename
      }
      if (featureFile) {
        extra.hero_feature_image = featureFile.filename
      }

      await upsertContentBlock('home', {
        title: title || null,
        body: body || null,
        ...extra,
      })

      const deleteIfExists = (filename) => {
        if (!filename) return
        const filepath = path.join(UPLOAD_DIR, filename)
        fs.unlink(filepath, () => {})
      }

      if (bannerFile && oldBannerFilename && oldBannerFilename !== bannerFile.filename) {
        deleteIfExists(oldBannerFilename)
      }
      if (featureFile && oldFeatureFilename && oldFeatureFilename !== featureFile.filename) {
        deleteIfExists(oldFeatureFilename)
      }

      res.json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Gagal menyimpan gambar hero home' })
    }
  },
)

app.get('/api/content/about', async (req, res) => {
  try {
    const block = (await getContentBlock('about')) || {}
    res.json({
      title: block.title || 'Tentang RS Pelita',
      body:
        block.body ||
        'Placeholder profil rumah sakit. Silakan isi melalui pengaturan konten.',
      vision_title: block.vision_title || 'Visi',
      vision_body:
        block.vision_body ||
        'Menjadi rumah sakit rujukan dengan pelayanan yang humanis dan profesional.',
      mission_title: block.mission_title || 'Misi',
      mission_body:
        block.mission_body ||
        'Memberikan pelayanan kesehatan bermutu dengan mengutamakan keselamatan pasien.',
      motto_title: block.motto_title || 'Motto',
      motto_body:
        block.motto_body ||
        'Motto singkat rumah sakit. Semua teks dapat diubah lewat admin.',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil konten tentang kami' })
  }
})

app.put('/api/content/about', authenticate, async (req, res) => {
  try {
    const {
      title,
      body,
      vision_title: visionTitle,
      vision_body: visionBody,
      mission_title: missionTitle,
      mission_body: missionBody,
      motto_title: mottoTitle,
      motto_body: mottoBody,
    } = req.body || {}
    await upsertContentBlock('about', {
      title: title || null,
      body: body || null,
      vision_title: visionTitle || null,
      vision_body: visionBody || null,
      mission_title: missionTitle || null,
      mission_body: missionBody || null,
      motto_title: mottoTitle || null,
      motto_body: mottoBody || null,
    })
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menyimpan konten tentang kami' })
  }
})

app.get('/api/contact', async (req, res) => {
  try {
    const block = (await getContentBlock('contact')) || {}
    res.json({
      hospital_name: block.hospital_name || 'RS Pelita',
      address:
        block.address ||
        'Placeholder alamat rumah sakit. Silakan isi melalui Pengaturan Konten.',
      phone: block.phone || 'Placeholder nomor telepon',
      email: block.email || 'placeholder@email.rs',
      whatsapp_number: block.whatsapp_number || '',
      map_embed: block.map_embed || '',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data kontak' })
  }
})

app.put('/api/contact', authenticate, async (req, res) => {
  try {
    const payload = req.body || {}
    await upsertContentBlock('contact', {
      title: null,
      body: null,
      hospital_name: payload.hospital_name || null,
      address: payload.address || null,
      phone: payload.phone || null,
      email: payload.email || null,
      whatsapp_number: payload.whatsapp_number || null,
      map_embed: payload.map_embed || null,
    })
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menyimpan data kontak' })
  }
})

app.get('/api/facilities', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || null
    const sql = 'SELECT id, name, description, image_path FROM facilities ORDER BY id DESC'
    const [rows] = await pool.query(limit ? `${sql} LIMIT ?` : sql, limit ? [limit] : [])
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description || null,
      image: row.image_path ? `${baseUrl}/uploads-rs-pelita/${row.image_path}` : null,
    }))
    res.json({ items })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil fasilitas' })
  }
})

app.post('/api/facilities', authenticate, upload.single('image'), async (req, res) => {
  try {
    const body = req.body || {}
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const description =
      typeof body.description === 'string' ? body.description.trim() || null : null
    const imagePath = req.file ? req.file.filename : null

    if (!name) {
      return res.status(400).json({ message: 'Nama fasilitas wajib diisi.' })
    }
    if (!imagePath) {
      return res.status(400).json({ message: 'Gambar fasilitas wajib diunggah.' })
    }

    await pool.query(
      'INSERT INTO facilities (name, description, image_path) VALUES (?, ?, ?)',
      [name, description, imagePath],
    )
    res.status(201).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menambah fasilitas' })
  }
})

app.delete('/api/facilities/:id', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await pool.query(
      'SELECT image_path FROM facilities WHERE id = ? LIMIT 1',
      [id],
    )
    if (rows.length > 0 && rows[0].image_path) {
      const filepath = path.join(UPLOAD_DIR, rows[0].image_path)
      fs.unlink(filepath, () => {})
    }
    await pool.query('DELETE FROM facilities WHERE id = ?', [id])
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menghapus fasilitas' })
  }
})

const DAYS_COLUMNS = [
  'schedule_senin',
  'schedule_selasa',
  'schedule_rabu',
  'schedule_kamis',
  'schedule_jumat',
  'schedule_sabtu',
]

app.get('/api/doctors', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || null
    const cols = [
      'id',
      'name',
      'specialty',
      'image_path',
      ...DAYS_COLUMNS,
    ].join(', ')
    const sql = `SELECT ${cols} FROM doctors ORDER BY id DESC`
    const [rows] = await pool.query(limit ? `${sql} LIMIT ?` : sql, limit ? [limit] : [])
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      specialty: row.specialty || null,
      image: row.image_path ? `${baseUrl}/uploads-rs-pelita/${row.image_path}` : null,
      ...DAYS_COLUMNS.reduce((acc, col) => {
        acc[col] = row[col] || null
        return acc
      }, {}),
    }))
    res.json({ items })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data dokter' })
  }
})

app.post(
  '/api/doctors',
  authenticate,
  upload.single('image'),
  async (req, res) => {
    try {
      const body = req.body || {}
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const specialty = typeof body.specialty === 'string' ? body.specialty.trim() || null : null
      if (!name) {
        return res.status(400).json({ message: 'Nama dokter wajib diisi.' })
      }
      const imagePath = req.file ? req.file.filename : null
      const values = [
        name,
        specialty,
        imagePath,
        body.schedule_senin || null,
        body.schedule_selasa || null,
        body.schedule_rabu || null,
        body.schedule_kamis || null,
        body.schedule_jumat || null,
        body.schedule_sabtu || null,
      ]
      const placeholders = DAYS_COLUMNS.map(() => '?').join(', ')
      await pool.query(
        `INSERT INTO doctors (name, specialty, image_path, ${DAYS_COLUMNS.join(', ')}) VALUES (?, ?, ?, ${placeholders})`,
        values,
      )
      res.status(201).json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Gagal menambah dokter' })
    }
  },
)

app.delete('/api/doctors/:id', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await pool.query(
      'SELECT image_path FROM doctors WHERE id = ? LIMIT 1',
      [id],
    )
    if (rows.length > 0 && rows[0].image_path) {
      const filepath = path.join(UPLOAD_DIR, rows[0].image_path)
      fs.unlink(filepath, () => {})
    }
    await pool.query('DELETE FROM doctors WHERE id = ?', [id])
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menghapus dokter' })
  }
})

app.get('/api/articles', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || null
    const sql =
      'SELECT id, title, excerpt, body, image_path, published_at FROM articles ORDER BY published_at DESC, id DESC'
    const [rows] = await pool.query(limit ? `${sql} LIMIT ?` : sql, limit ? [limit] : [])
    const items = rows.map((row) => ({
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      published_at: row.published_at,
      image: row.image_path
        ? `${req.protocol}://${req.get('host')}/uploads-rs-pelita/${row.image_path}`
        : null,
    }))
    res.json({ items })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil berita' })
  }
})

app.post(
  '/api/articles',
  authenticate,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, excerpt, body } = req.body || {}
      const filename = req.file ? req.file.filename : null
      await pool.query(
        `
          INSERT INTO articles (title, excerpt, body, image_path, published_at)
          VALUES (?, ?, ?, ?, NOW())
        `,
        [title, excerpt || null, body || null, filename],
      )
      res.status(201).json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Gagal menambah berita' })
    }
  },
)

app.delete('/api/articles/:id', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await pool.query(
      'SELECT image_path FROM articles WHERE id = ? LIMIT 1',
      [id],
    )
    if (rows.length > 0 && rows[0].image_path) {
      const filepath = path.join(UPLOAD_DIR, rows[0].image_path)
      fs.unlink(filepath, () => {})
    }
    await pool.query('DELETE FROM articles WHERE id = ?', [id])
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menghapus berita' })
  }
})

app.get('/api/dashboard/summary', authenticate, async (req, res) => {
  try {
    const [[facilities]] = await pool.query(
      'SELECT COUNT(*) AS count FROM facilities',
    )
    const [[doctors]] = await pool.query('SELECT COUNT(*) AS count FROM doctors')
    const [[articles]] = await pool.query(
      'SELECT COUNT(*) AS count FROM articles',
    )
    const [[activeDoctors]] = await pool.query(
      'SELECT COUNT(*) AS count FROM doctors WHERE schedule IS NOT NULL AND schedule <> ""',
    )

    res.json({
      facilities: facilities.count,
      doctors: doctors.count,
      articles: articles.count,
      activeDoctors: activeDoctors.count,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil ringkasan dashboard' })
  }
})

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error' })
  }
})

async function startServer() {
  try {
    await ensureFacilitiesImageColumn()
    app.listen(PORT, () => {
      console.log(`RS Pelita backend listening on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

startServer()

