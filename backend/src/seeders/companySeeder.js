import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Company from '../models/Company.js';
import connectDB from '../config/db.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const companies = [
  {
    name: 'PT. ROSALISCA GROUP',
    type: 'parent',
    slug: 'rosalisca-group',
    description: 'Perusahaan konstruksi terkemuka yang berfokus pada pembangunan infrastruktur berkelanjutan dan solusi konstruksi inovatif dengan pengalaman lebih dari satu dekade dalam industri konstruksi Indonesia.',
    address: 'Jl. Raya Kalimalang No. 88, Jakarta Timur 13620, Indonesia',
    phone: '+62 21 8611 5588',
    email: 'info@rosaliscagroup.com',
    website: 'https://www.rosaliscagroup.com',
    establishedYear: '2010',
    director: 'Ir. John Rosalim, M.T.',
    specialization: 'Konstruksi Infrastruktur & Bangunan Sipil',
    certifications: [
      'ISO 9001:2015 Quality Management System',
      'ISO 14001:2015 Environmental Management System',
      'OHSAS 18001:2007 Occupational Health & Safety',
      'Sertifikat Badan Usaha (SBU) Konstruksi',
      'CSMS Certificate'
    ],
    
    // About Us Content
    vision: 'Menjadi perusahaan konstruksi terdepan di Indonesia yang memberikan solusi infrastruktur berkelanjutan dan inovatif untuk kemajuan bangsa.',
    mission: 'Memberikan layanan konstruksi berkualitas tinggi dengan mengutamakan keselamatan kerja, efisiensi, dan kepuasan pelanggan melalui penerapan teknologi terkini dan sumber daya manusia yang kompeten.',
    values: [
      'Integritas - Berkomitmen pada kejujuran dan transparansi',
      'Kualitas - Mengutamakan standar kualitas tertinggi',
      'Inovasi - Menerapkan teknologi dan metode terbaru',
      'Keberlanjutan - Peduli lingkungan dan masa depan',
      'Profesionalisme - Bekerja sesuai standar industri terbaik',
      'Keselamatan - Mengutamakan K3 dalam setiap proyek'
    ],
    history: 'Didirikan pada tahun 2010 oleh Ir. John Rosalim, M.T., PT. Rosalisca Group telah berkembang menjadi salah satu perusahaan konstruksi terkemuka di Indonesia. Dimulai dari proyek-proyek kecil, kini kami telah menangani berbagai proyek infrastruktur besar di seluruh Indonesia. Dengan pengalaman lebih dari 15 tahun, kami telah membangun reputasi sebagai kontraktor yang dapat diandalkan.',
    achievements: [
      'Penghargaan Konstruksi Terbaik Indonesia 2023',
      'Best Infrastructure Company Award 2022',
      'Green Construction Award 2021',
      'Safety Excellence Award 2020-2023',
      'Sertifikasi ISO 9001:2015',
      'Member Indonesian Contractors Association (AKI)',
      'Lebih dari 500 proyek berhasil diselesaikan'
    ],
    services: [
      'Konstruksi Bangunan Gedung',
      'Infrastruktur Jalan dan Jembatan',
      'Sistem Pengolahan Air Limbah',
      'Sistem Drainase dan Irigasi',
      'Rehabilitasi dan Renovasi Bangunan',
      'Konsultansi Teknik Konstruksi',
      'Project Management',
      'Quality Assurance & Control'
    ],
    
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'PT. JHON DAN RO',
    type: 'subsidiary',
    slug: 'jhon-dan-ro',
    description: 'Anak perusahaan PT. Rosalisca Group yang mengkhususkan diri dalam bidang pengolahan air limbah dan sistem drainase dengan menggunakan teknologi terdepan dan ramah lingkungan.',
    address: 'Jl. TB Simatupang Kav. 1, Jakarta Selatan 12560, Indonesia',
    phone: '+62 21 7834 5566',
    email: 'info@jhonro.com',
    website: 'https://www.jhonro.com',
    establishedYear: '2012',
    director: 'Ir. Jane Smith, M.Eng.',
    specialization: 'Pengolahan Air Limbah & Sistem Drainase',
    certifications: [
      'ISO 9001:2015 Quality Management System',
      'ISO 14001:2015 Environmental Management System',
      'Sertifikat Ahli K3 Konstruksi',
      'BNSP Certified Water Treatment Specialist',
      'Environmental Impact Assessment License'
    ],
    
    // Profile specific content
    projectTypes: [
      'Sistem Pengolahan Air Limbah Domestik',
      'Sistem Pengolahan Air Limbah Industri',
      'Instalasi Pengolahan Air Limbah (IPAL)',
      'Sistem Drainase Perkotaan',
      'Pipe Jacking Technology',
      'Water Treatment Plant',
      'Sewage Treatment Plant'
    ],
    clientTypes: [
      'Pemerintah Daerah DKI Jakarta',
      'Kementerian PUPR',
      'Perusahaan Swasta Nasional',
      'Kawasan Industri',
      'Developer Perumahan',
      'Hotel dan Resort',
      'Rumah Sakit dan Fasilitas Kesehatan'
    ],
    expertise: [
      'Pipe Jacking Technology',
      'Advanced Biological Treatment',
      'SCADA Integration System',
      'Automated Monitoring System',
      'Membrane Bioreactor (MBR)',
      'Sequential Batch Reactor (SBR)',
      'Moving Bed Biofilm Reactor (MBBR)',
      'UV Disinfection System'
    ],
    companySize: '75-100 karyawan',
    yearlyRevenue: '25-50 Miliar',
    
    // About content
    vision: 'Menjadi perusahaan terdepan dalam solusi pengolahan air limbah yang berkelanjutan dan ramah lingkungan di Indonesia.',
    mission: 'Menyediakan teknologi pengolahan air limbah terbaik untuk menciptakan lingkungan yang bersih dan sehat bagi generasi mendatang.',
    values: [
      'Teknologi Terdepan',
      'Ramah Lingkungan',
      'Efisiensi Operasional',
      'Kualitas Terjamin',
      'Inovasi Berkelanjutan'
    ],
    services: [
      'Design & Build IPAL',
      'Operation & Maintenance',
      'Environmental Consulting',
      'Water Quality Testing',
      'System Upgrade & Retrofit'
    ],
    
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'PT. GUNUNG SAHID',
    type: 'subsidiary',
    slug: 'gunung-sahid',
    description: 'Anak perusahaan PT. Rosalisca Group yang berfokus pada pembangunan fasilitas pertanian modern, museum, dan laboratorium dengan mengintegrasikan teknologi IoT dan otomasi.',
    address: 'Jl. Raya Bogor KM 35, Cibinong, Bogor 16911, Jawa Barat',
    phone: '+62 21 8754 3322',
    email: 'info@gunungsahid.com',
    website: 'https://www.gunungsahid.com',
    establishedYear: '2015',
    director: 'Ir. Bob Johnson, M.Agr.',
    specialization: 'Pertanian Modern, Museum & Laboratorium',
    certifications: [
      'ISO 9001:2015 Quality Management System',
      'Good Agricultural Practices (GAP)',
      'Organic Certification Indonesia',
      'Museum Accreditation Certificate',
      'Laboratory ISO/IEC 17025:2017'
    ],
    
    projectTypes: [
      'Green House Modern',
      'Smart Farming System',
      'Museum dan Galeri',
      'Laboratory Facilities',
      'Research Center',
      'Agricultural Processing Plant',
      'Educational Facilities'
    ],
    clientTypes: [
      'Kementerian Pertanian RI',
      'Pemerintah Daerah',
      'Universitas dan Institut Penelitian',
      'Perusahaan Agribisnis',
      'Yayasan Pendidikan',
      'BUMN Pertanian',
      'International NGO'
    ],
    expertise: [
      'IoT-based Monitoring System',
      'Automated Climate Control',
      'Smart Irrigation Technology',
      'Interactive Display System',
      'Digital Museum Technology',
      'Laboratory Information Management System (LIMS)',
      'Precision Agriculture',
      'Hydroponic & Aeroponic Systems'
    ],
    companySize: '45-60 karyawan',
    yearlyRevenue: '15-30 Miliar',
    
    vision: 'Menjadi pionir dalam integrasi teknologi modern untuk kemajuan sektor pertanian dan edukasi di Indonesia.',
    mission: 'Mengembangkan fasilitas pertanian modern dan edukasi yang berkelanjutan melalui penerapan teknologi IoT dan otomasi.',
    values: [
      'Inovasi Teknologi',
      'Edukasi Berkelanjutan',
      'Pertanian Ramah Lingkungan',
      'Penelitian & Pengembangan',
      'Kolaborasi Akademik'
    ],
    services: [
      'Smart Greenhouse Construction',
      'Museum Design & Build',
      'Laboratory Setup',
      'IoT System Integration',
      'Agricultural Consulting',
      'Educational Program'
    ],
    
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'PT. ARIMADA PERSADA',
    type: 'subsidiary',
    slug: 'arimada-persada',
    description: 'Anak perusahaan PT. Rosalisca Group yang mengkhususkan diri dalam pembangunan kompleks perkantoran modern, infrastruktur jalan tol, dan kawasan industri dengan teknologi smart building.',
    address: 'Jl. Jend. Sudirman Kav. 52-53, Jakarta Pusat 10210, Indonesia',
    phone: '+62 21 5140 7788',
    email: 'info@arimadapersada.com',
    website: 'https://www.arimadapersada.com',
    establishedYear: '2018',
    director: 'Ir. Alice Brown, M.M.',
    specialization: 'Konstruksi Perkantoran & Infrastruktur Jalan',
    certifications: [
      'ISO 9001:2015 Quality Management System',
      'Green Building Council Indonesia (GBCI)',
      'Construction Safety Management System',
      'Smart Building Technology Certificate',
      'Highway Construction License'
    ],
    
    projectTypes: [
      'Kompleks Perkantoran Modern',
      'Smart Office Building',
      'Infrastruktur Jalan Tol',
      'Kawasan Industri Terpadu',
      'Commercial Complex',
      'Mixed-Use Development',
      'Infrastructure Maintenance'
    ],
    clientTypes: [
      'Perusahaan Multinasional',
      'Developer Swasta',
      'PT. Jasa Marga (Persero)',
      'Kawasan Industri',
      'BUMN dan BUMD',
      'Real Estate Developer',
      'Investment Company'
    ],
    expertise: [
      'Smart Building Automation',
      'Green Building Technology',
      'Intelligent Traffic System',
      'Smart Grid Integration',
      'Building Information Modeling (BIM)',
      'Energy Management System',
      'Advanced Security System',
      'Sustainable Construction Methods'
    ],
    companySize: '150-200 karyawan',
    yearlyRevenue: '75-150 Miliar',
    
    vision: 'Menjadi kontraktor terdepan dalam pembangunan infrastruktur modern dan berkelanjutan yang mendukung pertumbuhan ekonomi Indonesia.',
    mission: 'Membangun infrastruktur perkantoran dan jalan berkualitas tinggi dengan mengintegrasikan teknologi smart building dan sistem cerdas.',
    values: [
      'Smart Technology Integration',
      'Sustainable Development',
      'Quality Excellence',
      'Innovation Leadership',
      'Client Satisfaction'
    ],
    services: [
      'Office Building Construction',
      'Highway & Road Construction',
      'Smart Building System',
      'Infrastructure Consulting',
      'Project Management',
      'Maintenance Services'
    ],
    
    isActive: true,
    sortOrder: 4
  }
];

const seedCompanies = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting company seeding...');
    
    // Clear existing companies
    await Company.deleteMany({});
    console.log('🗑️  Cleared existing companies');
    
    // Insert new companies
    const createdCompanies = await Company.insertMany(companies);
    console.log(`✅ Successfully seeded ${createdCompanies.length} companies:`);
    
    createdCompanies.forEach(company => {
      console.log(`  - ${company.name} (${company.type})`);
    });
    
    console.log('🎉 Company seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding companies:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
    process.exit(0);
  }
};

// Run seeder if called directly
if (process.argv[1].includes('companySeeder.js')) {
  seedCompanies();
}

export default seedCompanies;
