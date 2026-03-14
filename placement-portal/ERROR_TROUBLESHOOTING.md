# 🔧 Error Troubleshooting Guide

## ✅ Current System Status

### **Backend API** - ✅ WORKING
- URL: http://localhost:5002
- Status: Running and responding
- Test Result: ✅ Login API working correctly

### **Frontend** - ✅ WORKING  
- URL: http://localhost:3000
- Status: Running and accessible
- Compilation: ✅ Successfully compiled (1 warning only)

## 🧪 Quick Test Steps

### **1. Test Backend API**
```bash
curl -X POST http://localhost:5002/api/student/login \
  -H "Content-Type: application/json" \
  -d '{"rollNumber": "21ME0001", "password": "test"}'
```
**Expected**: Success response with student data

### **2. Test Frontend Access**
Open browser: http://localhost:3000
**Expected**: Landing page should load

## 🚨 Common Errors & Solutions

### **Error: "Register number not found"**
**Cause**: Using wrong roll number
**Solution**: Use valid roll numbers from dataset:
- ✅ `21ME0001` (EEE dept)
- ✅ `21CS0004` (ME dept) 
- ✅ `21EC0006` (CSE dept)

### **Error: "Network error"**
**Cause**: Backend not running
**Solution**: Restart backend:
```bash
cd /Users/likki/Desktop/placements/placement-portal/backend
python3 app.py
```

### **Error: "Cannot access frontend"**
**Cause**: Frontend not running
**Solution**: Restart frontend:
```bash
cd /Users/likki/Desktop/placements/placement-portal
npm start
```

### **Error: "Compilation failed"**
**Cause**: Code errors
**Solution**: Check terminal for error messages

## 🔍 What to Do Now

### **Step 1**: Open Browser
Go to: http://localhost:3000

### **Step 2**: Try Login
1. Click "I'm a Student"
2. Enter: `21ME0001`
3. Enter any password
4. Click "Login as Student"

### **Step 3**: Check Result
Should redirect to: http://localhost:3000/student-dashboard

## 📞 If Still Getting Errors

Please tell me:
1. **What error message** do you see?
2. **Where** does the error appear (browser console, terminal, etc.)?
3. **What step** were you doing when error occurred?

## 🎯 Test Credentials

### **Student Login**
```
Roll Number: 21ME0001
Password: test123
Department: EEE
```

### **Faculty Login**  
```
Faculty ID: F100
Password: test123
Department: Computer Science
```

Both services are running correctly - the issue might be with the specific steps or credentials you're using!
