import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import Project from '../src/models/Project.js';
import Certificate from '../src/models/Certificate.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rosalisca_db';

const updateCompanyNames = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Update company name from "PT Jhon Ro" to "PT John dan Ro"
    const oldCompanyName = 'PT Jhon Ro';
    const newCompanyName = 'PT John dan Ro';

    console.log(`\n🔄 Updating company name from "${oldCompanyName}" to "${newCompanyName}"`);

    // Update Projects
    console.log('\n📁 Updating Projects...');
    const projectsResult = await Project.updateMany(
      { company: oldCompanyName },
      { company: newCompanyName }
    );
    console.log(`✅ Updated ${projectsResult.modifiedCount} projects`);

    // Update Certificates (subsidiary field)
    console.log('\n📋 Updating Certificates...');
    // Note: Certificate subsidiary uses uppercase format
    const certificatesResult = await Certificate.updateMany(
      { subsidiary: 'PT. JHON RO' },
      { subsidiary: 'PT. JOHN DAN RO' }
    );
    console.log(`✅ Updated ${certificatesResult.modifiedCount} certificates`);

    // Display summary
    console.log('\n📊 Update Summary:');
    console.log(`   Projects: ${projectsResult.modifiedCount} updated`);
    console.log(`   Certificates: ${certificatesResult.modifiedCount} updated`);

    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const remainingOldProjects = await Project.countDocuments({ company: oldCompanyName });
    const newProjects = await Project.countDocuments({ company: newCompanyName });
    const remainingOldCertificates = await Certificate.countDocuments({ subsidiary: 'PT. JHON RO' });
    const newCertificates = await Certificate.countDocuments({ subsidiary: 'PT. JOHN DAN RO' });

    console.log(`   Projects with old name: ${remainingOldProjects}`);
    console.log(`   Projects with new name: ${newProjects}`);
    console.log(`   Certificates with old subsidiary: ${remainingOldCertificates}`);
    console.log(`   Certificates with new subsidiary: ${newCertificates}`);

    if (remainingOldProjects === 0 && remainingOldCertificates === 0) {
      console.log('\n✅ All company names updated successfully!');
    } else {
      console.log('\n⚠️  Some records may still have the old company name');
    }

    // Show sample data to verify
    console.log('\n📋 Sample updated records:');
    const sampleProject = await Project.findOne({ company: newCompanyName });
    if (sampleProject) {
      console.log(`   Project: "${sampleProject.title}" - Company: ${sampleProject.company}`);
    }

    const sampleCertificate = await Certificate.findOne({ subsidiary: 'PT. JOHN DAN RO' });
    if (sampleCertificate) {
      console.log(`   Certificate: "${sampleCertificate.title}" - Subsidiary: ${sampleCertificate.subsidiary}`);
    }

  } catch (error) {
    console.error('❌ Error updating company names:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the update
updateCompanyNames();
