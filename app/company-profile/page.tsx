'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Award, Users, Target, Zap, Globe, ArrowRight } from 'lucide-react';

export default function CompanyProfile() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/landing" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">NATA GROUP</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/landing">
              <Button variant="ghost">Back</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">About Nata Group</h1>
          <p className="text-xl text-blue-100">Leading Construction & Real Estate Development Company in Indonesia</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 mb-4">
                Nata Group is a premier construction and real estate development company with over a decade of industry experience. We specialize in creating landmark residential and commercial projects that combine architectural excellence, innovative design, and sustainable practices.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 2014, Nata Group has grown to become one of Indonesia's most trusted developers, with a portfolio of successful projects across major cities.
              </p>
              <p className="text-lg text-gray-600">
                Our success is built on core values: integrity, quality, innovation, and customer satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <Target className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle className="text-2xl text-blue-600">10+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Years in Industry</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <Building2 className="w-8 h-8 text-green-600 mb-2" />
                  <CardTitle className="text-2xl text-green-600">25+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Projects Completed</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <Users className="w-8 h-8 text-purple-600 mb-2" />
                  <CardTitle className="text-2xl text-purple-600">250+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Happy Clients</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-gradient-to-br from-orange-50 to-white">
                <CardHeader>
                  <Globe className="w-8 h-8 text-orange-600 mb-2" />
                  <CardTitle className="text-2xl text-orange-600">500+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Units Sold</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-200">
              <CardHeader>
                <Target className="w-8 h-8 text-blue-600 mb-4" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To deliver world-class residential and commercial properties that enhance quality of life and create lasting value for our clients, stakeholders, and communities.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-600 mb-4" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To be Indonesia's most trusted and innovative real estate developer, recognized for excellence in construction quality, customer service, and sustainable development practices.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <Award className="w-8 h-8 text-green-600 mb-4" />
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2">
                  <li>• Integrity & Transparency</li>
                  <li>• Quality Excellence</li>
                  <li>• Innovation & Technology</li>
                  <li>• Customer Focus</li>
                  <li>• Sustainability</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Expertise & Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Expertise</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Residential Development', description: 'High-quality apartment complexes, condominiums, and landed properties' },
              { title: 'Commercial Projects', description: 'Modern office spaces, retail centers, and mixed-use developments' },
              { title: 'Infrastructure', description: 'Roads, utilities, and public facilities within our projects' },
              { title: 'Project Management', description: 'End-to-end project planning, execution, and delivery' },
              { title: 'Quality Assurance', description: 'Rigorous testing, inspection, and compliance processes' },
              { title: 'Customer Relations', description: 'Dedicated after-sales service and lifetime support' }
            ].map((service, idx) => (
              <Card key={idx} className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-blue-600">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Certifications */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Awards & Certifications</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { award: 'ISO 9001', desc: 'Quality Management' },
              { award: 'ISO 14001', desc: 'Environmental Management' },
              { award: 'OHSAS 18001', desc: 'Occupational Health & Safety' },
              { award: 'LEED Accredited', desc: 'Green Building Practices' },
              { award: 'Best Developer 2023', desc: 'Construction Excellence Award' },
              { award: 'Customer Choice', desc: 'Real Estate Excellence' },
              { award: 'Innovation Award', desc: 'Smart Construction Tech' },
              { award: 'Sustainability', desc: 'Green Building Initiative' }
            ].map((item, idx) => (
              <Card key={idx} className="border border-gray-200 bg-white hover:shadow-lg transition">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{item.award}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Leadership Team</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Budi Santoso', title: 'Founder & CEO', dept: 'Executive' },
              { name: 'Siti Nurhaliza', title: 'Director of Operations', dept: 'Operations' },
              { name: 'Ahmad Wijaya', title: 'Director of Projects', dept: 'Construction' },
              { name: 'Ratna Dewi', title: 'CFO', dept: 'Finance' }
            ].map((member, idx) => (
              <Card key={idx} className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4"></div>
                  <h4 className="font-bold text-gray-900 text-center mb-1">{member.name}</h4>
                  <p className="text-sm text-blue-600 text-center mb-2">{member.title}</p>
                  <p className="text-xs text-gray-500 text-center">{member.dept}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Log in to the monitoring platform to view real-time project updates and analytics.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 Nata Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
