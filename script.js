// Global variables
let currentUser = null;
let currentPage = 'landing';
let charts = {};

// Sample data for demonstration
const sampleData = {
    students: [
        {
            rollNo: "21CS001",
            name: "Alice Johnson",
            dept: "CSE",
            section: "A",
            aptitudeScore: 85,
            mockInterviewScore: 78,
            problemsSolved: 45,
            hackathonCount: 3,
            technicalTestScore: 82,
            resumeScore: 75,
            projectsCount: 2,
            placementReadiness: "High",
            placementProbabilities: 0.85
        },
        {
            rollNo: "21CS002", 
            name: "Bob Smith",
            dept: "CSE",
            section: "B",
            aptitudeScore: 72,
            mockInterviewScore: 68,
            problemsSolved: 25,
            hackathonCount: 1,
            technicalTestScore: 70,
            resumeScore: 65,
            projectsCount: 1,
            placementReadiness: "Medium",
            placementProbabilities: 0.65
        },
        {
            rollNo: "21ECE001",
            name: "Carol Davis",
            dept: "ECE",
            section: "A",
            aptitudeScore: 90,
            mockInterviewScore: 85,
            problemsSolved: 60,
            hackathonCount: 5,
            technicalTestScore: 88,
            resumeScore: 80,
            projectsCount: 3,
            placementReadiness: "High",
            placementProbabilities: 0.92
        }
    ]
};

// Page navigation functions
function showLogin() {
    hideAllPages();
    document.getElementById('loginPage').classList.add('active');
    currentPage = 'login';
}

function showFeatures() {
    const featuresSection = document.getElementById('featuresSection');
    featuresSection.style.display = featuresSection.style.display === 'none' ? 'block' : 'none';
}

function showDashboard() {
    hideAllPages();
    document.getElementById('facultyDashboard').classList.add('active');
    currentPage = 'dashboard';
    loadDashboardData();
}

function showPlacementPrediction() {
    hideAllPages();
    document.getElementById('placementPrediction').classList.add('active');
    currentPage = 'prediction';
}

function hideAllPages() {
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
}

// Authentication functions
function handleFacultyLogin(event) {
    event.preventDefault();
    const staffId = document.getElementById('staffId').value;
    const password = document.getElementById('facultyPassword').value;
    
    // Simple validation (in real app, this would be server-side)
    if (staffId && password) {
        currentUser = {
            type: 'faculty',
            id: staffId,
            name: 'Faculty User'
        };
        showDashboard();
        updateSidebar();
    } else {
        showAlert('Please enter valid credentials', 'danger');
    }
}

function handleStudentLogin(event) {
    event.preventDefault();
    const registerNumber = document.getElementById('registerNumber').value;
    const password = document.getElementById('studentPassword').value;
    
    // Simple validation (in real app, this would be server-side)
    if (registerNumber && password) {
        currentUser = {
            type: 'student',
            id: registerNumber,
            name: 'Student User'
        };
        showStudentDashboard();
        updateSidebar();
    } else {
        showAlert('Please enter valid credentials', 'danger');
    }
}

function logout() {
    currentUser = null;
    showLogin();
    updateSidebar();
}

// Dashboard functions
function loadDashboardData() {
    // Update stats
    document.getElementById('totalStudents').textContent = sampleData.students.length;
    document.getElementById('totalDepartments').textContent = [...new Set(sampleData.students.map(s => s.dept))].length;
    
    const highReadiness = sampleData.students.filter(s => s.placementReadiness === 'High').length;
    const placementRate = Math.round((highReadiness / sampleData.students.length) * 100);
    document.getElementById('placementRate').textContent = placementRate + '%';
    document.getElementById('topPerformers').textContent = highReadiness;
    
    // Create charts
    createDepartmentChart();
    createSectionChart();
}

function createDepartmentChart() {
    const ctx = document.getElementById('deptChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.deptChart) {
        charts.deptChart.destroy();
    }
    
    const deptData = {};
    sampleData.students.forEach(student => {
        deptData[student.dept] = (deptData[student.dept] || 0) + 1;
    });
    
    charts.deptChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(deptData),
            datasets: [{
                label: 'Students by Department',
                data: Object.values(deptData),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(237, 100, 166, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(118, 75, 162, 1)',
                    'rgba(237, 100, 166, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createSectionChart() {
    const ctx = document.getElementById('sectionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.sectionChart) {
        charts.sectionChart.destroy();
    }
    
    const sectionData = {};
    sampleData.students.forEach(student => {
        const key = `${student.dept} - ${student.section}`;
        sectionData[key] = (sectionData[key] || 0) + 1;
    });
    
    charts.sectionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(sectionData),
            datasets: [{
                data: Object.values(sectionData),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(237, 100, 166, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Placement Prediction
document.getElementById('predictionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = {
        section: document.getElementById('section').value,
        rollNumber: document.getElementById('rollNumber').value,
        department: document.getElementById('department').value,
        aptitudeScore: parseInt(document.getElementById('aptitudeScore').value),
        mockInterviewScore: parseInt(document.getElementById('mockInterview').value),
        problemsSolved: parseInt(document.getElementById('problemsSolved').value),
        hackathonCount: parseInt(document.getElementById('hackathonCount').value),
        technicalTestScore: parseInt(document.getElementById('technicalTest').value),
        resumeScore: parseInt(document.getElementById('resumeScore').value),
        projectsCount: parseInt(document.getElementById('projectsCount').value)
    };
    
    // Simple prediction logic (in real app, this would call your ML model)
    const prediction = generatePrediction(formData);
    displayPredictionResult(prediction);
});

function generatePrediction(formData) {
    // Simple scoring algorithm (replace with your actual ML model)
    let score = 0;
    let maxScore = 0;
    
    // Weight different factors
    score += formData.aptitudeScore * 0.15;
    maxScore += 100 * 0.15;
    
    score += formData.mockInterviewScore * 0.20;
    maxScore += 100 * 0.20;
    
    score += Math.min(formData.problemsSolved * 2, 100) * 0.15;
    maxScore += 100 * 0.15;
    
    score += Math.min(formData.hackathonCount * 20, 100) * 0.10;
    maxScore += 100 * 0.10;
    
    score += formData.technicalTestScore * 0.20;
    maxScore += 100 * 0.20;
    
    score += formData.resumeScore * 0.10;
    maxScore += 100 * 0.10;
    
    score += Math.min(formData.projectsCount * 25, 100) * 0.10;
    maxScore += 100 * 0.10;
    
    const probability = Math.round((score / maxScore) * 100);
    
    let readiness;
    if (probability >= 80) {
        readiness = "High";
    } else if (probability >= 60) {
        readiness = "Medium";
    } else {
        readiness = "Low";
    }
    
    return {
        readiness,
        probability,
        score: Math.round(score),
        maxScore: Math.round(maxScore)
    };
}

function displayPredictionResult(prediction) {
    const resultDiv = document.getElementById('predictionResult');
    
    let colorClass;
    if (prediction.probability >= 80) {
        colorClass = 'success';
    } else if (prediction.probability >= 60) {
        colorClass = 'warning';
    } else {
        colorClass = 'danger';
    }
    
    resultDiv.innerHTML = `
        <div class="alert alert-${colorClass}">
            <h5><i class="fas fa-chart-line"></i> Prediction Result</h5>
            <p><strong>Placement Readiness:</strong> ${prediction.readiness}</p>
            <p><strong>Placement Probability:</strong> ${prediction.probability}%</p>
            <div class="progress mb-3">
                <div class="progress-bar" style="width: ${prediction.probability}%"></div>
            </div>
            <p><strong>Overall Score:</strong> ${prediction.score}/${prediction.maxScore}</p>
        </div>
        
        <div class="recommendations">
            <h6><i class="fas fa-lightbulb"></i> Recommendations</h6>
            ${getRecommendations(prediction)}
        </div>
    `;
}

function getRecommendations(prediction) {
    let recommendations = [];
    
    if (prediction.probability < 80) {
        if (prediction.probability < 60) {
            recommendations.push("Focus on improving aptitude skills through regular practice");
            recommendations.push("Participate in mock interviews to build confidence");
            recommendations.push("Work on more coding problems and projects");
        } else {
            recommendations.push("Continue practicing coding problems");
            recommendations.push("Consider participating in hackathons");
            recommendations.push("Improve resume with relevant projects");
        }
    } else {
        recommendations.push("Maintain current performance level");
        recommendations.push("Focus on advanced topics and specialization");
    }
    
    return recommendations.map(rec => `
        <div class="recommendation-card">
            <h6>Recommendation</h6>
            <p>${rec}</p>
        </div>
    `).join('');
}

// Student Dashboard
function showStudentDashboard() {
    hideAllPages();
    
    // Create student dashboard content
    const dashboardHTML = `
        <div class="container-fluid">
            <h2 class="mb-4">Student Dashboard</h2>
            
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="student-card">
                        <h6><i class="fas fa-user"></i> Personal Information</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Register Number:</strong> ${currentUser.id}</p>
                                <p><strong>Name:</strong> ${currentUser.name}</p>
                                <p><strong>Department:</strong> CSE</p>
                                <p><strong>Section:</strong> A</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Overall Progress:</strong></p>
                                <div class="progress mb-2">
                                    <div class="progress-bar" style="width: 75%"></div>
                                </div>
                                <p class="text-muted">75% Complete</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="chart-card">
                        <h5>Skill Assessment</h5>
                        <canvas id="skillChart"></canvas>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="chart-card">
                        <h5>Progress Over Time</h5>
                        <canvas id="progressChart"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <div class="form-card">
                        <h5><i class="fas fa-graduation-cap"></i> Course Recommendations</h5>
                        <div id="courseRecommendations">
                            ${getCourseRecommendations()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create a temporary div for student dashboard
    const tempDiv = document.createElement('div');
    tempDiv.id = 'studentDashboard';
    tempDiv.className = 'page-content';
    tempDiv.innerHTML = dashboardHTML;
    
    // Remove existing student dashboard if any
    const existingDashboard = document.getElementById('studentDashboard');
    if (existingDashboard) {
        existingDashboard.remove();
    }
    
    // Add to main content
    document.getElementById('mainContent').appendChild(tempDiv);
    
    // Show the dashboard
    hideAllPages();
    tempDiv.classList.add('active');
    
    // Create charts
    setTimeout(() => {
        createStudentCharts();
    }, 100);
}

function createStudentCharts() {
    // Skill Chart
    const skillCtx = document.getElementById('skillChart');
    if (skillCtx) {
        if (charts.skillChart) charts.skillChart.destroy();
        
        charts.skillChart = new Chart(skillCtx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Aptitude', 'Technical', 'Communication', 'Projects', 'Interview'],
                datasets: [{
                    label: 'Current Skills',
                    data: [75, 80, 70, 65, 72],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Progress Chart
    const progressCtx = document.getElementById('progressChart');
    if (progressCtx) {
        if (charts.progressChart) charts.progressChart.destroy();
        
        charts.progressChart = new Chart(progressCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
                datasets: [{
                    label: 'Placement Readiness',
                    data: [45, 52, 58, 65, 70, 75],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

function getCourseRecommendations() {
    const recommendations = [
        {
            title: "Data Structures & Algorithms",
            description: "Improve problem-solving skills with advanced DSA concepts",
            priority: "High",
            duration: "8 weeks"
        },
        {
            title: "Communication Skills",
            description: "Enhance verbal and written communication for interviews",
            priority: "Medium",
            duration: "6 weeks"
        },
        {
            title: "Web Development Bootcamp",
            description: "Learn modern web technologies and build portfolio projects",
            priority: "High",
            duration: "12 weeks"
        }
    ];
    
    return recommendations.map(course => `
        <div class="recommendation-card">
            <h6>${course.title} <span class="badge bg-${course.priority === 'High' ? 'danger' : 'warning'}">${course.priority}</span></h6>
            <p>${course.description}</p>
            <small class="text-muted"><i class="fas fa-clock"></i> ${course.duration}</small>
        </div>
    `).join('');
}

// Sidebar update
function updateSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    if (currentUser) {
        // Update sidebar based on user type
        sidebarLinks.forEach(link => {
            link.onclick = function() {
                if (currentUser.type === 'faculty') {
                    if (this.textContent.includes('Dashboard')) {
                        showDashboard();
                    } else if (this.textContent.includes('Placement Prediction')) {
                        showPlacementPrediction();
                    } else if (this.textContent.includes('Reports')) {
                        showReports();
                    } else if (this.textContent.includes('Student Data')) {
                        showStudentSearch();
                    } else {
                        showAlert('Feature coming soon!', 'info');
                    }
                } else {
                    if (this.textContent.includes('Dashboard')) {
                        showStudentDashboard();
                    } else {
                        showAlert('Feature coming soon!', 'info');
                    }
                }
            };
        });
        
        // Add logout option
        const navbar = document.querySelector('.navbar-nav');
        const logoutLink = document.createElement('li');
        logoutLink.className = 'nav-item';
        logoutLink.innerHTML = `<a class="nav-link" href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
        navbar.appendChild(logoutLink);
    }
}

// Utility functions
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-5`;
    alertDiv.style.zIndex = '9999';
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show landing page by default
    document.getElementById('landingPage').classList.add('active');
    
    // Add event listeners to sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                showLogin();
            }
        });
    });
});

// Reports functionality
function showReports() {
    hideAllPages();
    document.getElementById('reportsPage').classList.add('active');
    currentPage = 'reports';
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportDept = document.getElementById('reportDept').value;
    const reportFormat = document.getElementById('reportFormat').value;
    
    // Show loading
    showAlert('Generating report...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        const reportName = `${reportType}_${reportDept}_${new Date().toISOString().split('T')[0]}.${reportFormat}`;
        
        // Add to reports table
        const reportsTable = document.getElementById('reportsTable');
        const newRow = reportsTable.insertRow(0);
        newRow.innerHTML = `
            <td>${reportName}</td>
            <td>${reportType}</td>
            <td>${new Date().toISOString().split('T')[0]}</td>
            <td><span class="badge bg-success">Completed</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="downloadReport('${reportName}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </td>
        `;
        
        showAlert('Report generated successfully!', 'success');
        
        // Trigger download
        downloadReport(reportName);
    }, 2000);
}

function downloadReport(reportName) {
    // Create sample data for download
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (reportName.includes('department')) {
        csvContent += "Department,Total Students,Placed Students,Placement Rate\n";
        csvContent += "CSE,45,38,84.4%\n";
        csvContent += "ECE,40,28,70.0%\n";
        csvContent += "EEE,35,20,57.1%\n";
        csvContent += "MECH,30,18,60.0%\n";
        csvContent += "CIVIL,25,12,48.0%\n";
    } else if (reportName.includes('section')) {
        csvContent += "Section,Total Students,Average Score,Placement Rate\n";
        csvContent += "CSE-A,25,78.5,88.0%\n";
        csvContent += "CSE-B,20,72.3,80.0%\n";
        csvContent += "ECE-A,20,68.7,75.0%\n";
        csvContent += "ECE-B,20,65.2,65.0%\n";
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", reportName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Student Search functionality
function showStudentSearch() {
    hideAllPages();
    document.getElementById('studentSearchPage').classList.add('active');
    currentPage = 'search';
}

function searchStudent() {
    const rollNumber = document.getElementById('searchRollNumber').value.toUpperCase();
    const department = document.getElementById('searchDept').value;
    
    if (!rollNumber && !department) {
        showAlert('Please enter roll number or select department', 'warning');
        return;
    }
    
    // Filter students based on search criteria
    let filteredStudents = sampleData.students;
    
    if (rollNumber) {
        filteredStudents = filteredStudents.filter(student => 
            student.rollNo.includes(rollNumber)
        );
    }
    
    if (department) {
        filteredStudents = filteredStudents.filter(student => 
            student.dept === department
        );
    }
    
    displayStudentResults(filteredStudents);
}

function displayStudentResults(students) {
    const resultsDiv = document.getElementById('studentResults');
    
    if (students.length === 0) {
        resultsDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> No students found matching your criteria.
            </div>
        `;
        resultsDiv.style.display = 'block';
        return;
    }
    
    let resultsHTML = '<h5 class="mb-3">Search Results</h5>';
    
    students.forEach((student, index) => {
        resultsHTML += `
            <div class="student-card mb-3">
                <div class="row">
                    <div class="col-md-8">
                        <h6><i class="fas fa-user"></i> ${student.name}</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Roll Number:</strong> ${student.rollNo}</p>
                                <p><strong>Department:</strong> ${student.dept}</p>
                                <p><strong>Section:</strong> ${student.section}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Placement Readiness:</strong> 
                                    <span class="badge bg-${student.placementReadiness === 'High' ? 'success' : student.placementReadiness === 'Medium' ? 'warning' : 'danger'}">
                                        ${student.placementReadiness}
                                    </span>
                                </p>
                                <p><strong>Placement Probability:</strong> ${Math.round(student.placementProbabilities * 100)}%</p>
                                <p><strong>Overall Score:</strong> ${calculateOverallScore(student)}/100</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <canvas id="studentChart${index}" width="200" height="200"></canvas>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12">
                        <h6>Performance Metrics</h6>
                        <div class="row">
                            <div class="col-md-3">
                                <small>Aptitude Score</small>
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${student.aptitudeScore}%">${student.aptitudeScore}</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <small>Mock Interview</small>
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${student.mockInterviewScore}%">${student.mockInterviewScore}</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <small>Technical Test</small>
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${student.technicalTestScore}%">${student.technicalTestScore}</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <small>Resume Score</small>
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${student.resumeScore}%">${student.resumeScore}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-4">
                                <small>Problems Solved: ${student.problemsSolved}</small>
                            </div>
                            <div class="col-md-4">
                                <small>Hackathons: ${student.hackathonCount}</small>
                            </div>
                            <div class="col-md-4">
                                <small>Projects: ${student.projectsCount}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
    
    // Create charts for each student
    setTimeout(() => {
        students.forEach((student, index) => {
            createStudentPerformanceChart(student, index);
        });
    }, 100);
}

function createStudentPerformanceChart(student, index) {
    const ctx = document.getElementById(`studentChart${index}`);
    if (!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['Aptitude', 'Interview', 'Technical', 'Resume', 'Practical'],
            datasets: [{
                label: student.name,
                data: [
                    student.aptitudeScore,
                    student.mockInterviewScore,
                    student.technicalTestScore,
                    student.resumeScore,
                    Math.min((student.problemsSolved + student.projectsCount * 10 + student.hackathonCount * 5), 100)
                ],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function calculateOverallScore(student) {
    const weights = {
        aptitudeScore: 0.15,
        mockInterviewScore: 0.20,
        technicalTestScore: 0.20,
        resumeScore: 0.10,
        problemsSolved: 0.15,
        hackathonCount: 0.10,
        projectsCount: 0.10
    };
    
    let score = 0;
    score += student.aptitudeScore * weights.aptitudeScore;
    score += student.mockInterviewScore * weights.mockInterviewScore;
    score += student.technicalTestScore * weights.technicalTestScore;
    score += student.resumeScore * weights.resumeScore;
    score += Math.min(student.problemsSolved * 2, 100) * weights.problemsSolved;
    score += Math.min(student.hackathonCount * 20, 100) * weights.hackathonCount;
    score += Math.min(student.projectsCount * 25, 100) * weights.projectsCount;
    
    return Math.round(score);
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
});
