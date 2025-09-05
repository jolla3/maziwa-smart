// import React, { useState, useEffect, useMemo } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
// import { 
//   LocalDrink, 
//   Pets, 
//   TrendingUp, 
//   Notifications, 
//   Add, 
//   MoreVert, 
//   Analytics, 
//   SmartToy, 
//   Assignment, 
//   Search,
//   FilterList,
//   Calendar,
//   ChevronRight,
//   AlertCircle,
//   CheckCircle,
//   Settings,
//   Download,
//   Bell,
//   X,
//   Filter,
//   ChevronDown,
//   TrendingDown,
//   Activity,
//   Zap,
//   Target
// } from 'lucide-react';

// // Live Data Service (simulates API calls)
// class LiveDataService {
//   constructor() {
//     this.listeners = [];
//     this.data = {
//       milkRecords: this.generateMilkData(),
//       cows: this.generateCowData(),
//       alerts: this.generateAlerts(),
//       thresholds: {
//         minDailyMilk: 8,
//         minHealthScore: 85,
//         maxDaysSinceCheck: 7,
//         criticalTemp: 39.5
//       }
//     };
//     this.startRealTimeUpdates();
//   }

//   generateMilkData() {
//     const now = new Date();
//     const data = [];
//     for (let i = 29; i >= 0; i--) {
//       const date = new Date(now);
//       date.setDate(date.getDate() - i);
//       data.push({
//         date: date.toISOString().split('T')[0],
//         liters: Math.round((20 + Math.random() * 15) * 10) / 10,
//         cows: 12 + Math.floor(Math.random() * 3),
//         temperature: Math.round((20 + Math.random() * 8) * 10) / 10,
//         efficiency: Math.round((85 + Math.random() * 12) * 10) / 10
//       });
//     }
//     return data;
//   }

//   generateCowData() {
//     const breeds = ['Holstein', 'Jersey', 'Guernsey', 'Brown Swiss', 'Ayrshire'];
//     const names = ['Bella', 'Daisy', 'Luna', 'Rosie', 'Moo', 'Bessie', 'Clara', 'Honey', 'Star', 'Buttercup'];
    
//     return names.map((name, i) => ({
//       id: i + 1,
//       name,
//       breed: breeds[Math.floor(Math.random() * breeds.length)],
//       dailyYield: Math.round((8 + Math.random() * 12) * 10) / 10,
//       status: Math.random() > 0.2 ? 'active' : 'dry',
//       lastMilked: this.getRandomTime(),
//       inseminationStatus: Math.random() > 0.6 ? 'pregnant' : 'open',
//       dueDate: Math.random() > 0.5 ? this.getFutureDate() : null,
//       healthScore: Math.round(70 + Math.random() * 30),
//       age: Math.round(2 + Math.random() * 6),
//       weight: Math.round(450 + Math.random() * 200),
//       bodyTemp: Math.round((38.5 + Math.random() * 1.5) * 10) / 10,
//       lastHealthCheck: this.getRandomPastDate(),
//       image: '🐄',
//       location: `Pasture ${Math.floor(Math.random() * 5) + 1}`,
//       feedIntake: Math.round((15 + Math.random() * 10) * 10) / 10
//     }));
//   }

//   generateAlerts() {
//     const types = ['health', 'performance', 'breeding', 'maintenance'];
//     const alerts = [];
//     for (let i = 0; i < 8; i++) {
//       alerts.push({
//         id: i + 1,
//         message: this.getRandomAlertMessage(),
//         type: types[Math.floor(Math.random() * types.length)],
//         severity: Math.random() > 0.3 ? 'medium' : 'high',
//         time: this.getRandomTime(),
//         cowId: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : null,
//         acknowledged: Math.random() > 0.7
//       });
//     }
//     return alerts;
//   }

//   getRandomAlertMessage() {
//     const messages = [
//       'Low milk yield detected',
//       'Health check due',
//       'Vaccination required',
//       'Temperature anomaly',
//       'Feed consumption below normal',
//       'Insemination confirmation needed',
//       'Equipment maintenance required',
//       'Abnormal behavior detected'
//     ];
//     return messages[Math.floor(Math.random() * messages.length)];
//   }

//   getRandomTime() {
//     const hours = Math.floor(Math.random() * 24);
//     return hours < 1 ? 'Just now' : `${hours}h ago`;
//   }

//   getFutureDate() {
//     const date = new Date();
//     date.setMonth(date.getMonth() + Math.floor(Math.random() * 6) + 1);
//     return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
//   }

//   getRandomPastDate() {
//     const date = new Date();
//     date.setDate(date.getDate() - Math.floor(Math.random() * 30));
//     return date.toLocaleDateString();
//   }

//   subscribe(callback) {
//     this.listeners.push(callback);
//     callback(this.data);
//   }

//   unsubscribe(callback) {
//     this.listeners = this.listeners.filter(l => l !== callback);
//   }

//   updateThresholds(newThresholds) {
//     this.data.thresholds = { ...this.data.thresholds, ...newThresholds };
//     this.checkThresholds();
//     this.notifyListeners();
//   }

//   checkThresholds() {
//     const newAlerts = [];
//     this.data.cows.forEach(cow => {
//       if (cow.dailyYield < this.data.thresholds.minDailyMilk) {
//         newAlerts.push({
//           id: Date.now() + Math.random(),
//           message: `${cow.name} milk yield below threshold (${cow.dailyYield}L)`,
//           type: 'performance',
//           severity: 'high',
//           time: 'Just now',
//           cowId: cow.id,
//           acknowledged: false
//         });
//       }
//       if (cow.healthScore < this.data.thresholds.minHealthScore) {
//         newAlerts.push({
//           id: Date.now() + Math.random(),
//           message: `${cow.name} health score below threshold (${cow.healthScore}%)`,
//           type: 'health',
//           severity: 'high',
//           time: 'Just now',
//           cowId: cow.id,
//           acknowledged: false
//         });
//       }
//     });
    
//     this.data.alerts = [...newAlerts, ...this.data.alerts.slice(0, 10)];
//   }

//   startRealTimeUpdates() {
//     setInterval(() => {
//       // Update milk data
//       const latest = this.data.milkRecords[this.data.milkRecords.length - 1];
//       if (latest) {
//         latest.liters = Math.round((latest.liters + (Math.random() - 0.5) * 2) * 10) / 10;
//         latest.efficiency = Math.round((latest.efficiency + (Math.random() - 0.5) * 5) * 10) / 10;
//       }

//       // Update cow data
//       this.data.cows.forEach(cow => {
//         cow.dailyYield = Math.max(0, cow.dailyYield + (Math.random() - 0.5) * 0.5);
//         cow.healthScore = Math.max(60, Math.min(100, cow.healthScore + (Math.random() - 0.5) * 2));
//         cow.bodyTemp = Math.max(37, Math.min(41, cow.bodyTemp + (Math.random() - 0.5) * 0.2));
//       });

//       this.checkThresholds();
//       this.notifyListeners();
//     }, 5000); // Update every 5 seconds
//   }

//   notifyListeners() {
//     this.listeners.forEach(callback => callback(this.data));
//   }
// }

// const liveDataService = new LiveDataService();

// const EnhancedFarmDashboard = () => {
//   const [currentTab, setCurrentTab] = useState(0);
//   const [liveData, setLiveData] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     breed: '',
//     status: '',
//     health: '',
//     dateRange: 'all'
//   });
//   const [showThresholdSettings, setShowThresholdSettings] = useState(false);
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [compareRange, setCompareRange] = useState('week');
//   const [selectedMetric, setSelectedMetric] = useState('liters');

//   useEffect(() => {
//     const handleDataUpdate = (data) => {
//       setLiveData(data);
//     };

//     liveDataService.subscribe(handleDataUpdate);
//     return () => liveDataService.unsubscribe(handleDataUpdate);
//   }, []);

//   // Enhanced search and filter logic
//   const filteredCows = useMemo(() => {
//     if (!liveData.cows) return [];
    
//     return liveData.cows.filter(cow => {
//       const matchesSearch = cow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           cow.breed.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesBreed = !filters.breed || cow.breed === filters.breed;
//       const matchesStatus = !filters.status || cow.status === filters.status;
      
//       let matchesHealth = true;
//       if (filters.health === 'excellent') matchesHealth = cow.healthScore >= 95;
//       else if (filters.health === 'good') matchesHealth = cow.healthScore >= 85 && cow.healthScore < 95;
//       else if (filters.health === 'poor') matchesHealth = cow.healthScore < 85;

//       return matchesSearch && matchesBreed && matchesStatus && matchesHealth;
//     });
//   }, [liveData.cows, searchTerm, filters]);

//   // Comparative analytics data
//   const comparativeData = useMemo(() => {
//     if (!liveData.milkRecords) return [];
    
//     const data = [...liveData.milkRecords];
//     const days = compareRange === 'week' ? 7 : compareRange === 'month' ? 30 : 365;
    
//     return data.slice(-days).map((record, index) => {
//       const prevIndex = Math.max(0, index - days);
//       const prevRecord = data[prevIndex] || record;
      
//       return {
//         ...record,
//         previousPeriod: prevRecord.liters,
//         growth: ((record.liters - prevRecord.liters) / prevRecord.liters * 100).toFixed(1),
//         trend: record.liters > prevRecord.liters ? 'up' : 'down'
//       };
//     });
//   }, [liveData.milkRecords, compareRange]);

//   // Breed distribution data for pie chart
//   const breedDistribution = useMemo(() => {
//     if (!liveData.cows) return [];
    
//     const breeds = {};
//     liveData.cows.forEach(cow => {
//       breeds[cow.breed] = (breeds[cow.breed] || 0) + 1;
//     });
    
//     const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
//     return Object.entries(breeds).map(([breed, count], index) => ({
//       name: breed,
//       value: count,
//       color: colors[index % colors.length]
//     }));
//   }, [liveData.cows]);

//   // Threshold Settings Modal
//   const ThresholdSettings = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowThresholdSettings(false)}>
//       <div className="bg-white rounded-2xl p-6 m-4 max-w-md w-full" onClick={e => e.stopPropagation()}>
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-lg font-bold">Alert Thresholds</h3>
//           <button onClick={() => setShowThresholdSettings(false)} className="text-gray-400 hover:text-gray-600">
//             <X size={24} />
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Daily Milk (L)</label>
//             <input 
//               type="number" 
//               defaultValue={liveData.thresholds?.minDailyMilk || 8}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               onChange={(e) => liveDataService.updateThresholds({minDailyMilk: parseFloat(e.target.value)})}
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Health Score (%)</label>
//             <input 
//               type="number" 
//               defaultValue={liveData.thresholds?.minHealthScore || 85}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               onChange={(e) => liveDataService.updateThresholds({minHealthScore: parseFloat(e.target.value)})}
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Max Days Since Check</label>
//             <input 
//               type="number" 
//               defaultValue={liveData.thresholds?.maxDaysSinceCheck || 7}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               onChange={(e) => liveDataService.updateThresholds({maxDaysSinceCheck: parseInt(e.target.value)})}
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Critical Temperature (°C)</label>
//             <input 
//               type="number" 
//               step="0.1"
//               defaultValue={liveData.thresholds?.criticalTemp || 39.5}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               onChange={(e) => liveDataService.updateThresholds({criticalTemp: parseFloat(e.target.value)})}
//             />
//           </div>
//         </div>
        
//         <div className="flex justify-end mt-6">
//           <button 
//             onClick={() => setShowThresholdSettings(false)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
//           >
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Enhanced Quick Stats with live data
//   const QuickStats = () => {
//     const totalDailyYield = filteredCows.filter(cow => cow.status === 'active')
//       .reduce((sum, cow) => sum + cow.dailyYield, 0);
//     const averageHealthScore = Math.round(filteredCows.reduce((sum, cow) => sum + cow.healthScore, 0) / filteredCows.length);
//     const pregnantCows = filteredCows.filter(cow => cow.inseminationStatus === 'pregnant').length;
//     const activeAlerts = liveData.alerts?.filter(alert => !alert.acknowledged).length || 0;

//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-3xl font-bold">{totalDailyYield.toFixed(1)}L</p>
//               <p className="text-blue-100 text-sm">Active Production</p>
//             </div>
//             <div className="bg-white bg-opacity-20 p-3 rounded-xl">
//               <LocalDrink size={32} />
//             </div>
//           </div>
//           <div className="mt-2 flex items-center">
//             <TrendingUp size={16} className="mr-1" />
//             <span className="text-sm">Live updating</span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-pink-500 to-red-500 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-3xl font-bold">{filteredCows.length}</p>
//               <p className="text-pink-100 text-sm">Total Cows</p>
//             </div>
//             <div className="bg-white bg-opacity-20 p-3 rounded-xl">
//               <Pets size={32} />
//             </div>
//           </div>
//           <div className="mt-2 flex items-center">
//             <Activity size={16} className="mr-1" />
//             <span className="text-sm">{filteredCows.filter(c => c.status === 'active').length} active</span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-3xl font-bold">{averageHealthScore || 0}%</p>
//               <p className="text-cyan-100 text-sm">Avg Health Score</p>
//             </div>
//             <div className="bg-white bg-opacity-20 p-3 rounded-xl">
//               <TrendingUp size={32} />
//             </div>
//           </div>
//           <div className="mt-2 flex items-center">
//             <Target size={16} className="mr-1" />
//             <span className="text-sm">Threshold: {liveData.thresholds?.minHealthScore}%</span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-3xl font-bold">{activeAlerts}</p>
//               <p className="text-yellow-100 text-sm">Active Alerts</p>
//             </div>
//             <div className="bg-white bg-opacity-20 p-3 rounded-xl">
//               <Bell size={32} />
//             </div>
//           </div>
//           <div className="mt-2 flex items-center">
//             <Zap size={16} className="mr-1" />
//             <span className="text-sm">Real-time monitoring</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Enhanced Production Chart with predictions
//   const ProductionChart = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-bold text-gray-800">Production Trends & Predictions</h3>
//         <div className="flex gap-2">
//           <select 
//             value={selectedMetric}
//             onChange={(e) => setSelectedMetric(e.target.value)}
//             className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
//           >
//             <option value="liters">Milk Yield</option>
//             <option value="efficiency">Efficiency</option>
//             <option value="temperature">Temperature</option>
//           </select>
//           <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
//             <Download size={16} />
//           </button>
//         </div>
//       </div>
//       <ResponsiveContainer width="100%" height={350}>
//         <ComposedChart data={liveData.milkRecords?.slice(-14) || []}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//           <XAxis dataKey="date" stroke="#666" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
//           <YAxis yAxisId="left" stroke="#666" />
//           <YAxis yAxisId="right" orientation="right" stroke="#666" />
//           <RechartsTooltip 
//             contentStyle={{ 
//               backgroundColor: '#fff', 
//               border: 'none', 
//               borderRadius: '12px', 
//               boxShadow: '0 8px 32px rgba(0,0,0,0.12)' 
//             }}
//             labelFormatter={(value) => new Date(value).toLocaleDateString()}
//           />
//           <Area yAxisId="left" type="monotone" dataKey={selectedMetric} fill="#4f46e5" fillOpacity={0.1} />
//           <Line yAxisId="left" type="monotone" dataKey={selectedMetric} stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }} />
//           <Bar yAxisId="right" dataKey="cows" fill="#10b981" opacity={0.3} />
//         </ComposedChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   // Breed Distribution Pie Chart
//   const BreedChart = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <h3 className="text-xl font-bold text-gray-800 mb-4">Breed Distribution</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={breedDistribution}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={120}
//             dataKey="value"
//             label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
//           >
//             {breedDistribution.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.color} />
//             ))}
//           </Pie>
//           <RechartsTooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   // Advanced Search and Filters
//   const SearchAndFilters = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//       <div className="flex flex-wrap gap-4 items-center">
//         <div className="flex-1 min-w-64">
//           <div className="relative">
//             <Search size={20} className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search cows by name or breed..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>
        
//         <div className="flex gap-2">
//           <select 
//             value={filters.breed}
//             onChange={(e) => setFilters({...filters, breed: e.target.value})}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Breeds</option>
//             <option value="Holstein">Holstein</option>
//             <option value="Jersey">Jersey</option>
//             <option value="Guernsey">Guernsey</option>
//           </select>
          
//           <select 
//             value={filters.status}
//             onChange={(e) => setFilters({...filters, status: e.target.value})}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="dry">Dry</option>
//           </select>
          
//           <select 
//             value={filters.health}
//             onChange={(e) => setFilters({...filters, health: e.target.value})}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Health</option>
//             <option value="excellent">Excellent (95%+)</option>
//             <option value="good">Good (85-94%)</option>
//             <option value="poor">Poor (&lt;85%)</option>
//           </select>
          
//           <button 
//             onClick={() => setFilters({breed: '', status: '', health: '', dateRange: 'all'})}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//           >
//             Clear
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Enhanced Alert System
//   const AlertSystem = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <Bell size={24} className="text-gray-600" />
//           <h3 className="text-xl font-bold text-gray-800">Live Alerts</h3>
//           <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
//             {liveData.alerts?.filter(a => !a.acknowledged).length || 0}
//           </div>
//         </div>
//         <button 
//           onClick={() => setShowThresholdSettings(true)}
//           className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
//         >
//           <Settings size={16} />
//           Thresholds
//         </button>
//       </div>
      
//       <div className="space-y-3 max-h-80 overflow-y-auto">
//         {liveData.alerts?.slice(0, 10).map((alert) => (
//           <div key={alert.id} className={`flex items-start justify-between p-3 rounded-lg border-l-4 ${
//             alert.severity === 'high' ? 'border-red-500 bg-red-50' : 
//             alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 
//             'border-blue-500 bg-blue-50'
//           } ${alert.acknowledged ? 'opacity-50' : ''}`}>
//             <div className="flex-1">
//               <div className="flex items-start gap-2">
//                 <div className={`p-1 rounded ${
//                   alert.severity === 'high' ? 'bg-red-100' : 
//                   alert.severity === 'medium' ? 'bg-yellow-100' : 
//                   'bg-blue-100'
//                 }`}>
//                   {alert.severity === 'high' ? (
//                     <AlertCircle size={16} className="text-red-600" />
//                   ) : (
//                     <Notifications size={16} className="text-blue-600" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-800 font-medium">{alert.message}</p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       alert.type === 'health' ? 'bg-red-100 text-red-800' :
//                       alert.type === 'performance' ? 'bg-yellow-100 text-yellow-800' :
//                       alert.type === 'breeding' ? 'bg-purple-100 text-purple-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {alert.type}
//                     </span>
//                     <span className="text-xs text-gray-500">{alert.time}</span>
//                     {alert.cowId && (
//                       <span className="text-xs text-blue-600">Cow #{alert.cowId}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {!alert.acknowledged && (
//               <button className="ml-2 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors">
//                 Ack
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // Comparative Analytics
//   const ComparativeAnalytics = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-bold text-gray-800">Comparative Analysis</h3>
//         <select 
//           value={compareRange}
//           onChange={(e) => setCompareRange(e.target.value)}
//           className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
//         >
//           <option value="week">vs Last Week</option>
//           <option value="month">vs Last Month</option>
//           <option value="year">vs Last Year</option>
//         </select>
//       </div>
      
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={comparativeData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//           <XAxis dataKey="date" stroke="#666" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
//           <YAxis stroke="#666" />
//           <RechartsTooltip 
//             contentStyle={{ 
//               backgroundColor: '#fff', 
//               border: 'none', 
//               borderRadius: '12px', 
//               boxShadow: '0 8px 32px rgba(0,0,0,0.12)' 
//             }}
//             formatter={(value, name) => [
//               `${value}${name === 'growth' ? '%' : 'L'}`,
//               name === 'liters' ? 'Current' : name === 'previousPeriod' ? 'Previous' : 'Growth'
//             ]}
//           />
//           <Line type="monotone" dataKey="liters" stroke="#4f46e5" strokeWidth={3} name="Current Period" />
//           <Line type="monotone" dataKey="previousPeriod" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Previous Period" />
//           <Line type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={2} name="Growth %" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   // Enhanced Cow Cards with live data
//   const CowPerformanceCards = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {filteredCows.map((cow) => (
//         <div key={cow.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
//                   cow.healthScore >= 95 ? 'bg-green-500' :
//                   cow.healthScore >= 85 ? 'bg-yellow-500' : 'bg-red-500'
//                 }`}>
//                   {cow.image}
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800">{cow.name}</h4>
//                   <p className="text-sm text-gray-500">{cow.breed} • {cow.age}y</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1">
//                 {cow.bodyTemp > (liveData.thresholds?.criticalTemp || 39.5) && (
//                   <AlertCircle size={16} className="text-red-500" />
//                 )}
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <MoreVert size={20} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex gap-2 mb-4">
//               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                 cow.status === 'active' 
//                   ? 'bg-green-100 text-green-800' 
//                   : 'bg-gray-100 text-gray-800'
//               }`}>
//                 {cow.status}
//               </span>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                 cow.inseminationStatus === 'pregnant' 
//                   ? 'bg-yellow-100 text-yellow-800' 
//                   : 'bg-blue-100 text-blue-800'
//               }`}>
//                 {cow.inseminationStatus}
//               </span>
//               {cow.dailyYield < (liveData.thresholds?.minDailyMilk || 8) && (
//                 <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
//                   Low Yield
//                 </span>
//               )}
//             </div>

//             <div className="space-y-2 mb-4">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Daily Yield:</span>
//                 <span className={`font-medium ${
//                   cow.dailyYield < (liveData.thresholds?.minDailyMilk || 8) ? 'text-red-600' : 'text-gray-800'
//                 }`}>
//                   {cow.dailyYield.toFixed(1)}L
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Body Temp:</span>
//                 <span className={`font-medium ${
//                   cow.bodyTemp > (liveData.thresholds?.criticalTemp || 39.5) ? 'text-red-600' : 'text-gray-800'
//                 }`}>
//                   {cow.bodyTemp}°C
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Weight:</span>
//                 <span className="font-medium text-gray-800">{cow.weight}kg</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-600">Location:</span>
//                 <span className="font-medium text-gray-800">{cow.location}</span>
//               </div>
//               {cow.dueDate && (
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Due:</span>
//                   <span className="font-medium text-gray-800">{cow.dueDate}</span>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">Health Score</span>
//                 <span className={`text-sm font-medium ${
//                   cow.healthScore < (liveData.thresholds?.minHealthScore || 85) ? 'text-red-600' : 'text-gray-800'
//                 }`}>
//                   {cow.healthScore}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className={`h-2 rounded-full transition-all duration-300 ${
//                     cow.healthScore >= 95 ? 'bg-green-500' : 
//                     cow.healthScore >= 85 ? 'bg-yellow-500' : 
//                     'bg-red-500'
//                   }`}
//                   style={{ width: `${cow.healthScore}%` }}
//                 />
//               </div>
//             </div>
            
//             <div className="mt-4 pt-4 border-t border-gray-100">
//               <div className="flex items-center justify-between text-xs text-gray-500">
//                 <span>Last Check: {cow.lastHealthCheck}</span>
//                 <div className="flex items-center gap-1">
//                   <div className={`w-2 h-2 rounded-full ${
//                     cow.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
//                   }`}></div>
//                   <span>Live</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const tabs = ['Overview', 'My Cows', 'Analytics', 'Alerts'];

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//         <div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Farm Dashboard</h1>
//           <p className="text-gray-600">Real-time monitoring with smart alerts and predictive analytics</p>
//         </div>
//         <div className="flex gap-3 mt-4 md:mt-0">
//           <button 
//             onClick={() => setShowThresholdSettings(true)}
//             className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-colors shadow-lg"
//           >
//             <Settings size={24} />
//           </button>
//           <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-lg">
//             <SmartToy size={24} />
//           </button>
//           <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all duration-300">
//             <Add size={20} />
//             Add Record
//           </button>
//         </div>
//       </div>

//       {/* Live Status Indicator */}
//       <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-xl">
//         <div className="flex items-center gap-3">
//           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//           <span className="font-medium">System Status: Live & Monitoring</span>
//           <span className="text-sm opacity-75">Last update: {new Date().toLocaleTimeString()}</span>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-sm">Active Alerts: {liveData.alerts?.filter(a => !a.acknowledged).length || 0}</span>
//           <span className="text-sm">Monitoring: {liveData.cows?.length || 0} cows</span>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <QuickStats />

//       {/* Navigation Tabs */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200 overflow-x-auto">
//           <nav className="flex space-x-8 min-w-max">
//             {tabs.map((tab, index) => (
//               <button
//                 key={tab}
//                 onClick={() => setCurrentTab(index)}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
//                   currentTab === index
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Tab Content */}
//       {currentTab === 0 && (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <ProductionChart />
//             </div>
//             <div>
//               <BreedChart />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <ComparativeAnalytics />
//             <AlertSystem />
//           </div>
//         </div>
//       )}

//       {currentTab === 1 && (
//         <div className="space-y-6">
//           <SearchAndFilters />
//           <CowPerformanceCards />
//         </div>
//       )}

//       {currentTab === 2 && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <ComparativeAnalytics />
//           <BreedChart />
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Trends</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={liveData.milkRecords?.slice(-30) || []}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                 <XAxis dataKey="date" stroke="#666" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
//                 <YAxis stroke="#666" />
//                 <RechartsTooltip 
//                   contentStyle={{ 
//                     backgroundColor: '#fff', 
//                     border: 'none', 
//                     borderRadius: '12px', 
//                     boxShadow: '0 8px 32px rgba(0,0,0,0.12)' 
//                   }}
//                 />
//                 <Area type="monotone" dataKey="liters" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
//                 <Area type="monotone" dataKey="efficiency" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Predictive Analytics</h3>
//             <div className="space-y-4">
//               <div className="p-4 bg-blue-50 rounded-lg">
//                 <h4 className="font-semibold text-blue-900 mb-2">Milk Production Forecast</h4>
//                 <p className="text-blue-700 text-sm">Based on current trends, expect 15-20% increase next month</p>
//               </div>
//               <div className="p-4 bg-yellow-50 rounded-lg">
//                 <h4 className="font-semibold text-yellow-900 mb-2">Health Risk Assessment</h4>
//                 <p className="text-yellow-700 text-sm">3 cows showing early signs of stress - monitor closely</p>
//               </div>
//               <div className="p-4 bg-green-50 rounded-lg">
//                 <h4 className="font-semibold text-green-900 mb-2">Breeding Optimization</h4>
//                 <p className="text-green-700 text-sm">Optimal breeding window opens in 2 weeks for 5 cows</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {currentTab === 3 && (
//         <div className="space-y-6">
//           <AlertSystem />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Alert Statistics</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">High Priority</span>
//                   <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {liveData.alerts?.filter(a => a.severity === 'high' && !a.acknowledged).length || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Medium Priority</span>
//                   <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {liveData.alerts?.filter(a => a.severity === 'medium' && !a.acknowledged).length || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Acknowledged</span>
//                   <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {liveData.alerts?.filter(a => a.acknowledged).length || 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Alert Types</h3>
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={[
//                       { name: 'Health', value: liveData.alerts?.filter(a => a.type === 'health').length || 0, color: '#ef4444' },
//                       { name: 'Performance', value: liveData.alerts?.filter(a => a.type === 'performance').length || 0, color: '#f59e0b' },
//                       { name: 'Breeding', value: liveData.alerts?.filter(a => a.type === 'breeding').length || 0, color: '#8b5cf6' },
//                       { name: 'Maintenance', value: liveData.alerts?.filter(a => a.type === 'maintenance').length || 0, color: '#6b7280' }
//                     ]}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     dataKey="value"
//                   >
//                     {[
//                       { name: 'Health', value: liveData.alerts?.filter(a => a.type === 'health').length || 0, color: '#ef4444' },
//                       { name: 'Performance', value: liveData.alerts?.filter(a => a.type === 'performance').length || 0, color: '#f59e0b' },
//                       { name: 'Breeding', value: liveData.alerts?.filter(a => a.type === 'breeding').length || 0, color: '#8b5cf6' },
//                       { name: 'Maintenance', value: liveData.alerts?.filter(a => a.type === 'maintenance').length || 0, color: '#6b7280' }
//                     ].map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <RechartsTooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Response Time</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Average Response</span>
//                   <span className="text-sm font-medium">2.3 hours</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Critical Alerts</span>
//                   <span className="text-sm font-medium text-green-600"> 30 min</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Resolution Rate</span>
//                   <span className="text-sm font-medium text-blue-600">94%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Threshold Settings Modal */}
//       {showThresholdSettings && <ThresholdSettings />}
//     </div>
//   );
// };

// export default EnhancedFarmDashboard;