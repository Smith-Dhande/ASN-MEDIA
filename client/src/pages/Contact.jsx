import React, { useState } from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Reveal } from '../components/ui/Reveal';
import { siteConfig } from '../data/site';
import { servicesData } from '../data/services';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'Social Media Management',
    description: '',
    budget: '$5,000 - $10,000',
    timeline: 'Within 1 Month',
    websiteHp: '' // Honeypot field for spam protection
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const budgetOptions = [
    '< $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+'
  ];

  const timelineOptions = [
    'Immediately',
    'Within 1 Month',
    '1 - 3 Months',
    'Flexible'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please provide a brief description of your project';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Spam honeypot check
    if (formData.websiteHp) {
      // Silent bot catch
      setIsSubmitted(true);
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    // Simulate async submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="pt-32 pb-24 md:pt-40 bg-[#F7F5EF]">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <Reveal>
            <SectionLabel>START A PROJECT</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#0A0A0A] mb-6">
              Let's talk about your idea.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-[#66615A] font-body leading-relaxed">
              Have a project in mind, need creative support, or looking to scale your brand's presence? Fill out the brief below and our strategy team will respond within 24 hours.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Direct Contact Info (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8 p-8 bg-[#0A0A0A] text-[#F7F5EF] rounded-[8px] border border-white/10 shadow-xl">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C8A13A] uppercase font-semibold block mb-2">
                DIRECT EMAIL
              </span>
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-display text-2xl text-white hover:text-[#C8A13A] transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>

            <div className="pt-6 border-t border-white/10">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C8A13A] uppercase font-semibold block mb-2">
                LOCATION
              </span>
              <p className="text-sm text-white/80 font-body">
                {siteConfig.location}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C8A13A] uppercase font-semibold block mb-2">
                SOCIAL PRESENCE
              </span>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                {siteConfig.socials.map((soc) => (
                  <li key={soc.label}>
                    <a
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#C8A13A] transition-colors inline-flex items-center gap-1.5"
                    >
                      {soc.label} ({soc.handle})
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 text-[11px] font-mono text-white/40">
              AVERAGE RESPONSE TIME: &lt; 24 HOURS
            </div>
          </div>

          {/* Contact Brief Form (8 Cols) */}
          <div className="lg:col-span-8 bg-[#FFFFFF] p-8 sm:p-12 rounded-[8px] border border-[#0A0A0A]/10 shadow-md">
            {isSubmitted ? (
              <div className="py-16 text-center flex flex-col items-center max-w-md mx-auto animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#C8A13A]/20 text-[#8E722A] flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="font-display text-4xl text-[#0A0A0A] mb-3">
                  Message Received
                </h2>
                <p className="text-sm text-[#66615A] font-body leading-relaxed mb-8">
                  Thank you for reaching out to ASN Media. Our strategic leadership team will review your project brief and get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-[#0A0A0A] text-[#F7F5EF] text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-[#C8A13A] hover:text-[#0A0A0A] transition-all"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
                {/* Honeypot field hidden from users */}
                <input
                  type="text"
                  name="websiteHp"
                  value={formData.websiteHp}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex="-1"
                  autocomplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-semibold tracking-wider text-[#0A0A0A] uppercase">
                      YOUR NAME <span className="text-[#8E722A]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={handleChange}
                      className={`px-4 py-3.5 bg-[#F7F5EF] border rounded-sm text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#C8A13A] ${
                        errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#0A0A0A]/14'
                      }`}
                    />
                    {errors.name && <span className="text-xs text-red-600 font-mono">{errors.name}</span>}
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="text-xs font-semibold tracking-wider text-[#0A0A0A] uppercase">
                      COMPANY / BRAND
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      placeholder="e.g. Lumina Design Studio"
                      value={formData.company}
                      onChange={handleChange}
                      className="px-4 py-3.5 bg-[#F7F5EF] border border-[#0A0A0A]/14 rounded-sm text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#C8A13A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-semibold tracking-wider text-[#0A0A0A] uppercase">
                      EMAIL ADDRESS <span className="text-[#8E722A]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`px-4 py-3.5 bg-[#F7F5EF] border rounded-sm text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#C8A13A] ${
                        errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#0A0A0A]/14'
                      }`}
                    />
                    {errors.email && <span className="text-xs text-red-600 font-mono">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-xs font-semibold tracking-wider text-[#0A0A0A] uppercase">
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="px-4 py-3.5 bg-[#F7F5EF] border border-[#0A0A0A]/14 rounded-sm text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#C8A13A]"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-xs font-semibold tracking-wider text-[#0A0A0A] uppercase">
                    SERVICE INTERESTED IN
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="px-4 py-3.5 bg-[#F7F5EF] border border-[#0A0A0A]/14 rounded-sm text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#C8A13A]"
                  >
                    {servicesData.map((svc) => (
                      <option key={svc.id} value={svc.title}>
                        {svc.title}
                      </option>
                    ))}
                    <option value="Multiple Services">Multiple / Full Retainer</option>
                  </select>
                </div>

                {/* Budget Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-[#0A0A0A] uppercase">
                    ESTIMATED BUDGET RANGE (OPTIONAL)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, budget: opt }))}
                        className={`py-2.5 px-3 text-xs font-medium border rounded-sm transition-all focus:outline-none ${
                          formData.budget === opt
                            ? 'bg-[#0A0A0A] text-[#F7F5EF] border-[#0A0A0A]'
                            : 'bg-[#F7F5EF] text-[#66615A] border-[#0A0A0A]/14 hover:border-[#0A0A0A]/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Description */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="text-xs font-semibold tracking-wider text-[#0A0A0A] uppercase">
                    PROJECT DESCRIPTION & GOALS <span className="text-[#8E722A]">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    placeholder="Tell us about your brand, current challenges, objectives, and timeline expectations..."
                    value={formData.description}
                    onChange={handleChange}
                    className={`p-4 bg-[#F7F5EF] border rounded-sm text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#C8A13A] ${
                      errors.description ? 'border-red-500 bg-red-50/20' : 'border-[#0A0A0A]/14'
                    }`}
                  />
                  {errors.description && (
                    <span className="text-xs text-red-600 font-mono">{errors.description}</span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0A0A0A] text-[#F7F5EF] text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#C8A13A] hover:text-[#0A0A0A] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#C8A13A]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Start a conversation</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
