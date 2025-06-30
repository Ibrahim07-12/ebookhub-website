"use client";

import { motion } from "framer-motion";
import { BookOpen, Download, Star, Users, ArrowRight, Play, TrendingUp, BarChart3, DollarSign } from "lucide-react";

export function HeroSection() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8 pr-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-gray-300"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              EbookHub v1.1
              <ArrowRight className="w-4 h-4" />
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">Digital Learning,</span><br />
                <span className="text-white">Knowledge</span><br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Platform
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Advanced ebook management, progress tracking, and personalized learning experience made for 
                <span className="text-white font-semibold"> Modern Learners</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => window.location.href = '#categories'}
              >
                Start Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-8 pt-8"
            >
              <div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Active Learners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-400">Premium Ebooks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-sm text-gray-400">User Rating</div>
              </div>
            </motion.div>
          </div>

          {/* Right 3D iPad Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-end items-center"
          >
            {/* Floating Background Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            
            {/* 3D iPad Container */}
            <div className="relative" style={{ perspective: '1000px' }}>
              {/* iPad Body with 3D Transform */}
              <motion.div 
                initial={{ rotateY: 45, rotateX: 15 }}
                animate={{ rotateY: -25, rotateX: 8 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative transform hover:scale-105 transition-transform duration-500"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-25deg) rotateX(8deg) scale(1.1)'
                }}
              >
                {/* iPad Outer Frame */}
                <div className="relative w-96 h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 shadow-2xl border border-gray-700">
                  {/* iPad Screen */}
                  <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative">
                    {/* Screen Content - File Manager Interface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center p-3 text-white text-xs">
                        <span className="font-semibold">9:41</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                          </div>
                          <span className="text-xs">100%</span>
                          <div className="w-4 h-2 border border-white rounded-sm">
                            <div className="w-full h-full bg-green-400 rounded-sm"></div>
                          </div>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="px-4 py-3 border-b border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-bold text-lg">EbookHub</h3>
                            <p className="text-gray-400 text-sm">1,247 ebooks • 12.3 GB</p>
                          </div>
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Category Folders Grid */}
                      <div className="p-4 grid grid-cols-3 gap-3">
                        {[
                          { name: "Business", count: "45", color: "from-blue-500 to-blue-600", icon: "💼" },
                          { name: "Tech", count: "67", color: "from-purple-500 to-purple-600", icon: "💻" },
                          { name: "Design", count: "38", color: "from-green-500 to-green-600", icon: "🎨" },
                          { name: "Marketing", count: "29", color: "from-orange-500 to-orange-600", icon: "📊" },
                          { name: "Finance", count: "52", color: "from-red-500 to-red-600", icon: "💰" },
                          { name: "Health", count: "34", color: "from-pink-500 to-pink-600", icon: "🏥" }
                        ].map((folder, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 hover:bg-gray-700/60 transition-all duration-200 border border-gray-700/30"
                          >
                            <div className={`w-8 h-8 bg-gradient-to-br ${folder.color} rounded-lg flex items-center justify-center mb-2 text-sm shadow-lg`}>
                              {folder.icon}
                            </div>
                            <h4 className="text-white text-xs font-semibold truncate">{folder.name}</h4>
                            <p className="text-gray-400 text-xs">{folder.count} files</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Recent Downloads Section */}
                      <div className="px-4 py-2">
                        <h4 className="text-gray-300 text-sm font-semibold mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Recent Downloads
                        </h4>
                        <div className="space-y-2">
                          {[
                            { name: "Digital Marketing 2025.pdf", size: "2.4 MB", time: "2m ago", progress: 100 },
                            { name: "React Advanced Guide.epub", size: "1.8 MB", time: "5m ago", progress: 85 },
                            { name: "Financial Freedom.pdf", size: "3.1 MB", time: "1h ago", progress: 100 }
                          ].map((file, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                              className="flex items-center space-x-3 p-2 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/30"
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-xs">
                                📄
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-medium truncate">{file.name}</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-400 text-xs">{file.size} • {file.time}</p>
                                  {file.progress < 100 && (
                                    <div className="w-8 h-1 bg-gray-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${file.progress}%` }}
                                      ></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full"></div>
                  </div>

                  {/* iPad Physical Elements */}
                  {/* Power Button */}
                  <div className="absolute -right-1 top-16 w-1 h-8 bg-gray-600 rounded-r shadow-inner"></div>
                  {/* Volume Buttons */}
                  <div className="absolute -right-1 top-28 w-1 h-6 bg-gray-600 rounded-r shadow-inner"></div>
                  <div className="absolute -right-1 top-36 w-1 h-6 bg-gray-600 rounded-r shadow-inner"></div>
                  {/* Silent Switch */}
                  <div className="absolute -left-1 top-20 w-1 h-4 bg-gray-600 rounded-l shadow-inner"></div>
                </div>

                {/* iPad Shadow */}
                <div className="absolute inset-0 bg-black/30 rounded-3xl transform translate-y-8 translate-x-6 -z-10 blur-2xl"></div>
              </motion.div>

              {/* Floating Download Icons with Animation */}
              <div className="absolute -right-8 top-8 space-y-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/30 animate-bounce shadow-lg"
                >
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.7 }}
                  className="w-10 h-10 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-500/30 animate-bounce delay-300 shadow-lg"
                >
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </motion.div>
              </div>

              {/* Success Notification */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2 }}
                className="absolute -left-8 top-12 bg-green-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg border border-green-400/30"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Download Complete!</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
