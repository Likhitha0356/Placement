from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np
import os
import json
import urllib.request

app = Flask(__name__)
CORS(app)

# Load the trained models and data
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Optional: fetch additional faculty from public API (Random User API - used as sample faculty database)
FACULTY_API_URL = 'https://randomuser.me/api/?results=8&inc=name,email,phone,picture&noinfo'

def load_faculty_data():
    faculty_path = os.path.join(DATA_DIR, 'faculty.json')
    data = {}
    if os.path.exists(faculty_path):
        with open(faculty_path, 'r') as f:
            data = json.load(f)
    # Merge with online faculty database (Random User API - public resource)
    try:
        req = urllib.request.Request(FACULTY_API_URL, headers={'User-Agent': 'PlacementPortal/1.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            api_data = json.loads(resp.read().decode())
        for i, u in enumerate(api_data.get('results', [])):
            fid = f"F{i+100}"
            if fid in data:
                continue
            name = f"{u['name'].get('title', '')} {u['name'].get('first', '')} {u['name'].get('last', '')}".strip()
            dept = ['Computer Science', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Management'][i % 7]
            data[fid] = {
                'id': fid,
                'name': name or f'Faculty {fid}',
                'email': u.get('email', f'{fid.lower()}@college.edu'),
                'phone': u.get('phone', ''),
                'department': dept,
                'designation': ['Professor', 'Associate Professor', 'Assistant Professor', 'Senior Lecturer'][i % 4],
                'experience': 5 + (i % 15),
                'education': [{'degree': 'Ph.D.', 'university': 'University', 'year': str(2010 + i)}],
                'expertise': ['Teaching', 'Research', 'Placement'],
                'publications': i * 3,
                'studentsMentored': 50 + i * 20,
                'courses': ['Core Subject', 'Elective'],
                'officeLocation': f'Block {chr(65 + i % 5)}, Room {100 + i}',
                'officeHours': 'Mon-Wed 10AM-12PM',
                'bio': f'Faculty member from {dept} department.',
                'achievements': ['Teaching Excellence'],
                'researchInterests': ['Placement', 'Career Guidance'],
                'linkedin': '',
                'website': ''
            }
        print("✅ Loaded faculty from online API (Random User API)")
    except Exception as e:
        print(f"⚠️ Could not fetch online faculty: {e}")
    return data

try:
    with open(os.path.join(MODEL_DIR, 'placement_classifier.pkl'), 'rb') as f:
        classifier = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'placement_regressor.pkl'), 'rb') as f:
        regressor = pickle.load(f)
    
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    classifier = None
    regressor = None

# Load student data from CSV
def load_student_data():
    csv_path = os.path.join(DATA_DIR, 'placement_dataset_10000.csv')
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            students = {}
            for _, row in df.iterrows():
                students[str(row['RollNo'])] = {
                    'name': row.get('Name', f"Student {row['RollNo']}"),
                    'rollNo': str(row['RollNo']),
                    'dept': row.get('Dept', 'Unknown'),
                    'section': row.get('Sec', 'A'),
                    'aptitudeScore': row.get('Aptitude_Score', 0),
                    'mockInterviewScore': row.get('Mock_Interview_Score', 0),
                    'problemsSolved': row.get('Problems_Solved', 0),
                    'hackathonCount': row.get('Hackathon_Count', 0),
                    'technicalTestScore': row.get('Technical_Test_Score', 0),
                    'resumeScore': row.get('Resume_Score', 0),
                    'projectsCount': row.get('Projects_Count', 0),
                    'placementReadiness': row.get('Placement_Readiness', 'Not Ready'),
                    'placementProbabilities': row.get('Placement_Probabilities', 0.0)
                }
            print(f"✅ Loaded {len(students)} students from your dataset")
            return students
        except Exception as e:
            print(f"❌ Error loading CSV: {e}")
            return get_sample_student_data()
    else:
        print("⚠️ Dataset CSV not found, using sample data")
        return get_sample_student_data()

# Sample student data (fallback)
def get_sample_student_data():
    return {
        '21CS001': {
            'name': 'Alice Johnson',
            'dept': 'CSE',
            'section': 'A',
            'aptitudeScore': 85,
            'mockInterviewScore': 78,
            'problemsSolved': 45,
            'hackathonCount': 3,
            'technicalTestScore': 82,
            'resumeScore': 75,
            'projectsCount': 2,
            'placementReadiness': 'High',
            'placementProbabilities': 0.85
        },
        '21CS002': {
            'name': 'Bob Smith',
            'dept': 'CSE',
            'section': 'B',
            'aptitudeScore': 72,
            'mockInterviewScore': 68,
            'problemsSolved': 25,
            'hackathonCount': 1,
            'technicalTestScore': 70,
            'resumeScore': 65,
            'projectsCount': 1,
            'placementReadiness': 'Medium',
            'placementProbabilities': 0.65
        },
        '21ECE001': {
            'name': 'Carol Davis',
            'dept': 'ECE',
            'section': 'A',
            'aptitudeScore': 90,
            'mockInterviewScore': 85,
            'problemsSolved': 60,
            'hackathonCount': 5,
            'technicalTestScore': 88,
            'resumeScore': 80,
            'projectsCount': 3,
            'placementReadiness': 'High',
            'placementProbabilities': 0.92
        }
    }

# Global student and faculty data
students_data = load_student_data()
faculty_data = load_faculty_data()

@app.route('/api/faculty/<faculty_id>')
def get_faculty(faculty_id):
    faculty = faculty_data.get(faculty_id) or faculty_data.get('default')
    if faculty:
        return jsonify({
            'success': True,
            'data': { **faculty, 'id': faculty_id if faculty_id in faculty_data else faculty.get('id', faculty_id) }
        })
    return jsonify({
        'success': False,
        'message': 'Faculty not found'
    }), 404

@app.route('/api/student/login', methods=['POST'])
def student_login():
    try:
        data = request.get_json()
        roll_number = data.get('rollNumber', '').strip()
        password = data.get('password', '').strip()
        
        if not roll_number or not password:
            return jsonify({
                'success': False,
                'message': 'Roll number and password are required'
            }), 400
        
        # Check if student exists in dataset
        student = students_data.get(roll_number)
        
        if not student:
            return jsonify({
                'success': False,
                'message': f'Register number {roll_number} not found in dataset'
            }), 404
        
        # Simple password validation (in production, use proper authentication)
        # For demo purposes, accept any non-empty password
        if not password:
            return jsonify({
                'success': False,
                'message': 'Password is required'
            }), 400
        
        # Return student data with authentication token
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': {
                'id': student['rollNo'],
                'rollNo': student['rollNo'],
                'name': student['name'],
                'type': 'student',
                'dept': student['dept'],
                'section': student['section'],
                'aptitudeScore': student['aptitudeScore'],
                'mockInterviewScore': student['mockInterviewScore'],
                'problemsSolved': student['problemsSolved'],
                'hackathonCount': student['hackathonCount'],
                'technicalTestScore': student['technicalTestScore'],
                'resumeScore': student['resumeScore'],
                'projectsCount': student['projectsCount'],
                'placementReadiness': student['placementReadiness'],
                'placementProbabilities': student['placementProbabilities']
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Login error: {str(e)}'
        }), 500

@app.route('/api/faculty/login', methods=['POST'])
def faculty_login():
    try:
        data = request.get_json()
        faculty_id = data.get('facultyId', '').strip()
        password = data.get('password', '').strip()
        
        if not faculty_id or not password:
            return jsonify({
                'success': False,
                'message': 'Faculty ID and password are required'
            }), 400
        
        # Check if faculty exists
        faculty = faculty_data.get(faculty_id) or faculty_data.get('default')
        
        if not faculty:
            return jsonify({
                'success': False,
                'message': 'Faculty not found'
            }), 404
        
        # Simple password validation (in production, use proper authentication)
        if not password:
            return jsonify({
                'success': False,
                'message': 'Password is required'
            }), 400
        
        # Return faculty data with authentication token
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': {
                'id': faculty.get('id', faculty_id),
                'name': faculty['name'],
                'type': 'faculty',
                'email': faculty['email'],
                'phone': faculty['phone'],
                'department': faculty['department'],
                'designation': faculty['designation'],
                'experience': faculty['experience'],
                'education': faculty['education'],
                'expertise': faculty['expertise'],
                'publications': faculty['publications'],
                'studentsMentored': faculty['studentsMentored'],
                'courses': faculty['courses'],
                'officeLocation': faculty['officeLocation'],
                'officeHours': faculty['officeHours'],
                'bio': faculty['bio'],
                'achievements': faculty['achievements'],
                'researchInterests': faculty['researchInterests'],
                'linkedin': faculty['linkedin'],
                'website': faculty['website']
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Login error: {str(e)}'
        }), 500

@app.route('/api/student/<roll_number>')
def get_student(roll_number):
    student = students_data.get(roll_number)
    
    if student:
        return jsonify({
            'success': True,
            'data': student
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Student not found'
        }), 404

@app.route('/api/students')
def get_all_students():
    return jsonify({
        'success': True,
        'data': students_data
    })

@app.route('/api/predict', methods=['POST'])
def predict_placement():
    if not classifier or not regressor:
        return jsonify({
            'success': False,
            'message': 'Models not loaded'
        }), 500
    
    try:
        data = request.get_json()
        
        # Prepare features for prediction
        features = np.array([[
            data['aptitudeScore'],
            data['mockInterviewScore'],
            data['problemsSolved'],
            data['hackathonCount'],
            data['technicalTestScore'],
            data['resumeScore'],
            data['projectsCount']
        ]])
        
        # Make predictions
        readiness_class = classifier.predict(features)[0]
        probability = regressor.predict(features)[0]
        
        # Map class to readable format
        readiness_map = {0: 'Low', 1: 'Medium', 2: 'High'}
        readiness = readiness_map.get(readiness_class, 'Medium')
        
        # Generate recommendations based on prediction
        recommendations = generate_recommendations(readiness, probability, data)
        
        return jsonify({
            'success': True,
            'prediction': {
                'readiness': readiness,
                'probability': float(probability),
                'recommendations': recommendations
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/dashboard/stats')
def get_dashboard_stats():
    students = students_data
    
    # Calculate statistics
    total_students = len(students)
    departments = len(set(student['dept'] for student in students.values()))
    ready_students = sum(1 for student in students.values() if student['placementReadiness'] == 'Ready')
    placement_rate = (ready_students / total_students * 100) if total_students > 0 else 0
    
    # Department-wise stats
    dept_stats = {}
    for student in students.values():
        dept = student['dept']
        if dept not in dept_stats:
            dept_stats[dept] = {'total': 0, 'placed': 0, 'avgScore': 0, 'scores': []}
        dept_stats[dept]['total'] += 1
        if student['placementReadiness'] == 'Ready':
            dept_stats[dept]['placed'] += 1
        # Calculate average score
        overall_score = (
            student['aptitudeScore'] * 0.15 +
            student['mockInterviewScore'] * 0.20 +
            student['technicalTestScore'] * 0.20 +
            student['resumeScore'] * 0.10 +
            min(student['problemsSolved'] * 2, 100) * 0.15 +
            min(student['hackathonCount'] * 20, 100) * 0.10 +
            min(student['projectsCount'] * 25, 100) * 0.10
        )
        dept_stats[dept]['scores'].append(overall_score)
    
    # Calculate averages
    for dept in dept_stats:
        if dept_stats[dept]['scores']:
            dept_stats[dept]['avgScore'] = round(sum(dept_stats[dept]['scores']) / len(dept_stats[dept]['scores']), 1)
        del dept_stats[dept]['scores']
    
    # Section-wise stats
    section_stats = {}
    for student in students.values():
        key = f"{student['dept']}-{student['section']}"
        if key not in section_stats:
            section_stats[key] = {'total': 0, 'avgScore': 0, 'scores': []}
        section_stats[key]['total'] += 1
        overall_score = (
            student['aptitudeScore'] * 0.15 +
            student['mockInterviewScore'] * 0.20 +
            student['technicalTestScore'] * 0.20 +
            student['resumeScore'] * 0.10 +
            min(student['problemsSolved'] * 2, 100) * 0.15 +
            min(student['hackathonCount'] * 20, 100) * 0.10 +
            min(student['projectsCount'] * 25, 100) * 0.10
        )
        section_stats[key]['scores'].append(overall_score)
    
    # Calculate section averages
    for section in section_stats:
        if section_stats[section]['scores']:
            section_stats[section]['avgScore'] = round(sum(section_stats[section]['scores']) / len(section_stats[section]['scores']), 1)
        del section_stats[section]['scores']
    
    return jsonify({
        'success': True,
        'stats': {
            'totalStudents': total_students,
            'totalDepartments': departments,
            'placementRate': round(placement_rate, 1),
            'topPerformers': ready_students,
            'departmentStats': dept_stats,
            'sectionStats': section_stats
        }
    })

def generate_recommendations(readiness, probability, data):
    recommendations = []
    
    if probability < 0.6:
        recommendations.extend([
            "Focus on improving aptitude skills through regular practice",
            "Participate in mock interviews to build confidence",
            "Work on more coding problems and projects"
        ])
    elif probability < 0.8:
        recommendations.extend([
            "Continue practicing coding problems",
            "Consider participating in hackathons",
            "Improve resume with relevant projects"
        ])
    else:
        recommendations.extend([
            "Maintain current performance level",
            "Focus on advanced topics and specialization"
        ])
    
    # Specific recommendations based on weak areas
    if data.get('aptitudeScore', 0) < 70:
        recommendations.append("Improve quantitative aptitude with daily practice")
    
    if data.get('mockInterviewScore', 0) < 70:
        recommendations.append("Practice communication and interview skills")
    
    if data.get('problemsSolved', 0) < 30:
        recommendations.append("Solve more coding problems on platforms like LeetCode")
    
    return recommendations

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_loaded': classifier is not None and regressor is not None
    })

if __name__ == '__main__':
    app.run(debug=True, port=5002)
