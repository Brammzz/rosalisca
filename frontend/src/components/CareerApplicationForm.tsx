import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';
import careerService from '@/services/careerService';

interface Career {
  _id: string;
  title: string;
  location: string;
  experienceLevel: string;
  description: string;
  closeDate: string;
}

interface CareerApplicationFormProps {
  career: Career;
  onSuccess?: () => void;
  onClose?: () => void;
}

interface FormData {
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
    };
    dateOfBirth: string;
    gender: string;
  };
  experience: {
    totalYears: number;
    currentPosition: string;
    currentCompany: string;
    previousPositions: Array<{
      position: string;
      company: string;
      duration: string;
      description: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
    }>;
  };
  education: Array<{
    degree: string;
    institution: string;
    major: string;
    graduationYear: number;
    gpa: number;
    maxGpa: number;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  motivation: string;
  expectedSalary: {
    amount: number;
    currency: string;
    negotiable: boolean;
  };
  availabilityDate: string;
}

interface Files {
  resume?: File;
  coverLetter?: File;
  portfolio?: File;
  certificates?: File[];
}

const CareerApplicationForm: React.FC<CareerApplicationFormProps> = ({ career, onSuccess, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    applicant: {
      fullName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        province: '',
        postalCode: ''
      },
      dateOfBirth: '',
      gender: 'prefer-not-to-say'
    },
    experience: {
      totalYears: 0,
      currentPosition: '',
      currentCompany: '',
      previousPositions: []
    },
    education: [{
      degree: '',
      institution: '',
      major: '',
      graduationYear: new Date().getFullYear(),
      gpa: 0,
      maxGpa: 4
    }],
    skills: [{ name: '', level: 'intermediate' }],
    languages: [{ language: 'Bahasa Indonesia', proficiency: 'native' }],
    motivation: '',
    expectedSalary: {
      amount: 0,
      currency: 'IDR',
      negotiable: true
    },
    availabilityDate: ''
  });

  const [files, setFiles] = useState<Files>({});

  const totalSteps = 5;

  const handleFileChange = (field: keyof Files, file: File | File[] | null) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const response = await careerService.submitApplication(career._id, formData, files);
      
      if (response.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        major: '',
        graduationYear: new Date().getFullYear(),
        gpa: 0,
        maxGpa: 4
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'intermediate' }]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: 'intermediate' }]
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        previousPositions: [...prev.experience.previousPositions, {
          position: '',
          company: '',
          duration: '',
          description: '',
          startDate: '',
          endDate: '',
          isCurrent: false
        }]
      }
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        previousPositions: prev.experience.previousPositions.filter((_, i) => i !== index)
      }
    }));
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-construction-blue-600 hover:bg-construction-blue-700 text-white">
            Lamar Sekarang
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Lamaran Berhasil Dikirim!
            </h3>
            <p className="text-gray-600 mb-6">
              Terima kasih telah melamar untuk posisi {career.title}. Tim HR kami akan meninjau aplikasi Anda dan menghubungi dalam 3-5 hari kerja.
            </p>
            <Button onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-construction-blue-600 hover:bg-construction-blue-700 text-white">
          Lamar Sekarang
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Lamar untuk {career.title}
          </DialogTitle>
          <DialogDescription>
            Isi formulir di bawah ini untuk melamar posisi ini.
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
            <span>Langkah {currentStep} dari {totalSteps}</span>
            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-construction-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Pribadi</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <Input
                    value={formData.applicant.fullName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      applicant: { ...prev.applicant, fullName: e.target.value }
                    }))}
                    placeholder="Nama lengkap sesuai KTP"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.applicant.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      applicant: { ...prev.applicant, email: e.target.value }
                    }))}
                    placeholder="alamat@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <Input
                    type="tel"
                    value={formData.applicant.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      applicant: { ...prev.applicant, phone: e.target.value }
                    }))}
                    placeholder="08XXXXXXXXXX"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <Input
                    type="date"
                    value={formData.applicant.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      applicant: { ...prev.applicant, dateOfBirth: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.applicant.gender}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      applicant: { ...prev.applicant, gender: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="prefer-not-to-say">Tidak ingin menyebutkan</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      value={formData.applicant.address.street}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        applicant: {
                          ...prev.applicant,
                          address: { ...prev.applicant.address, street: e.target.value }
                        }
                      }))}
                      placeholder="Alamat lengkap"
                    />
                  </div>
                  <Input
                    value={formData.applicant.address.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      applicant: {
                        ...prev.applicant,
                        address: { ...prev.applicant.address, city: e.target.value }
                      }
                    }))}
                    placeholder="Kota"
                  />
                  <Input
                    value={formData.applicant.address.province}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      applicant: {
                        ...prev.applicant,
                        address: { ...prev.applicant.address, province: e.target.value }
                      }
                    }))}
                    placeholder="Provinsi"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pengalaman Kerja</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Pengalaman (tahun)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.experience.totalYears}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      experience: { ...prev.experience, totalYears: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi Saat Ini
                  </label>
                  <Input
                    value={formData.experience.currentPosition}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      experience: { ...prev.experience, currentPosition: e.target.value }
                    }))}
                    placeholder="Jabatan saat ini"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perusahaan Saat Ini
                  </label>
                  <Input
                    value={formData.experience.currentCompany}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      experience: { ...prev.experience, currentCompany: e.target.value }
                    }))}
                    placeholder="Nama perusahaan"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Pengalaman Sebelumnya</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperience}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                  </Button>
                </div>
                
                {formData.experience.previousPositions.map((exp, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={exp.position}
                          onChange={(e) => {
                            const updated = [...formData.experience.previousPositions];
                            updated[index].position = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              experience: { ...prev.experience, previousPositions: updated }
                            }));
                          }}
                          placeholder="Jabatan"
                        />
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...formData.experience.previousPositions];
                            updated[index].company = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              experience: { ...prev.experience, previousPositions: updated }
                            }));
                          }}
                          placeholder="Nama perusahaan"
                        />
                        <Input
                          value={exp.duration}
                          onChange={(e) => {
                            const updated = [...formData.experience.previousPositions];
                            updated[index].duration = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              experience: { ...prev.experience, previousPositions: updated }
                            }));
                          }}
                          placeholder="Durasi (contoh: 2 tahun 3 bulan)"
                        />
                        <div className="flex space-x-2">
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...formData.experience.previousPositions];
                              updated[index].startDate = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                experience: { ...prev.experience, previousPositions: updated }
                              }));
                            }}
                            placeholder="Mulai"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeExperience(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        className="mt-4"
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...formData.experience.previousPositions];
                          updated[index].description = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            experience: { ...prev.experience, previousPositions: updated }
                          }));
                        }}
                        placeholder="Deskripsi pekerjaan dan pencapaian"
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pendidikan</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>
              
              {formData.education.map((edu, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenjang Pendidikan
                        </label>
                        <select
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[index].degree = e.target.value;
                            setFormData(prev => ({ ...prev, education: updated }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Pilih Jenjang</option>
                          <option value="SMA/SMK">SMA/SMK</option>
                          <option value="D3">Diploma 3</option>
                          <option value="S1">Sarjana (S1)</option>
                          <option value="S2">Magister (S2)</option>
                          <option value="S3">Doktor (S3)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institusi
                        </label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[index].institution = e.target.value;
                            setFormData(prev => ({ ...prev, education: updated }));
                          }}
                          placeholder="Nama sekolah/universitas"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jurusan
                        </label>
                        <Input
                          value={edu.major}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[index].major = e.target.value;
                            setFormData(prev => ({ ...prev, education: updated }));
                          }}
                          placeholder="Nama jurusan"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tahun Lulus
                        </label>
                        <Input
                          type="number"
                          value={edu.graduationYear}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[index].graduationYear = parseInt(e.target.value) || new Date().getFullYear();
                            setFormData(prev => ({ ...prev, education: updated }));
                          }}
                          min="1990"
                          max={new Date().getFullYear() + 10}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IPK/Nilai
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={edu.gpa}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[index].gpa = parseFloat(e.target.value) || 0;
                              setFormData(prev => ({ ...prev, education: updated }));
                            }}
                            placeholder="3.50"
                          />
                          <span className="flex items-center px-2 text-gray-500">/</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={edu.maxGpa}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[index].maxGpa = parseFloat(e.target.value) || 4;
                              setFormData(prev => ({ ...prev, education: updated }));
                            }}
                            placeholder="4.00"
                          />
                        </div>
                      </div>
                      
                      {formData.education.length > 1 && (
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeEducation(index)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 4: Skills & Additional Info */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Keahlian</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkill}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                  </Button>
                </div>
                
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...formData.skills];
                        updated[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, skills: updated }));
                      }}
                      placeholder="Nama keahlian"
                      className="flex-1"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...formData.skills];
                        updated[index].level = e.target.value;
                        setFormData(prev => ({ ...prev, skills: updated }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="beginner">Pemula</option>
                      <option value="intermediate">Menengah</option>
                      <option value="advanced">Mahir</option>
                      <option value="expert">Ahli</option>
                    </select>
                    {formData.skills.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Bahasa</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLanguage}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                  </Button>
                </div>
                
                {formData.languages.map((lang, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={lang.language}
                      onChange={(e) => {
                        const updated = [...formData.languages];
                        updated[index].language = e.target.value;
                        setFormData(prev => ({ ...prev, languages: updated }));
                      }}
                      placeholder="Nama bahasa"
                      className="flex-1"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => {
                        const updated = [...formData.languages];
                        updated[index].proficiency = e.target.value;
                        setFormData(prev => ({ ...prev, languages: updated }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="basic">Dasar</option>
                      <option value="intermediate">Menengah</option>
                      <option value="advanced">Mahir</option>
                      <option value="native">Native</option>
                    </select>
                    {formData.languages.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeLanguage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivasi & Alasan Melamar
                </label>
                <Textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  placeholder="Jelaskan mengapa Anda tertarik dengan posisi ini dan apa yang dapat Anda kontribusikan..."
                  rows={4}
                />
              </div>

              {/* Salary & Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ekspektasi Gaji (IDR)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={formData.expectedSalary.amount}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        expectedSalary: { ...prev.expectedSalary, amount: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.expectedSalary.negotiable}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          expectedSalary: { ...prev.expectedSalary, negotiable: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Negotiable</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dapat Mulai Kerja
                  </label>
                  <Input
                    type="date"
                    value={formData.availabilityDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, availabilityDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dokumen Pendukung</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV * (PDF, DOC, DOCX - Max 10MB)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600">
                        {files.resume ? files.resume.name : 'Klik untuk upload resume'}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (PDF, DOC, DOCX - Max 10MB)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange('coverLetter', e.target.files?.[0] || null)}
                      className="hidden"
                      id="cover-letter-upload"
                    />
                    <label htmlFor="cover-letter-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600">
                        {files.coverLetter ? files.coverLetter.name : 'Klik untuk upload cover letter'}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio (PDF, ZIP, RAR - Max 10MB)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.zip,.rar"
                      onChange={(e) => handleFileChange('portfolio', e.target.files?.[0] || null)}
                      className="hidden"
                      id="portfolio-upload"
                    />
                    <label htmlFor="portfolio-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600">
                        {files.portfolio ? files.portfolio.name : 'Klik untuk upload portfolio'}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sertifikat (PDF, JPG, PNG - Max 5 files)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => handleFileChange('certificates', Array.from(e.target.files || []))}
                      className="hidden"
                      id="certificates-upload"
                    />
                    <label htmlFor="certificates-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600">
                        {files.certificates?.length 
                          ? `${files.certificates.length} file(s) dipilih`
                          : 'Klik untuk upload sertifikat'
                        }
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Catatan Penting:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Resume/CV wajib diupload</li>
                  <li>• Pastikan file tidak corrupt dan dapat dibuka</li>
                  <li>• Format file yang didukung: PDF, DOC, DOCX untuk dokumen teks</li>
                  <li>• Maksimal ukuran file 10MB per file</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Sebelumnya
              </Button>
            )}
          </div>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
            >
              Batal
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Selanjutnya
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !files.resume}
                className="bg-construction-blue-600 hover:bg-construction-blue-700"
              >
                {loading ? 'Mengirim...' : 'Kirim Lamaran'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CareerApplicationForm;
