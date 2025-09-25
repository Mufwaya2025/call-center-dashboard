#!/usr/bin/env python3
"""
Google Drive Upload Script
This script uploads files to Google Drive using the gdrive command-line tool.
"""

import os
import subprocess
import sys
import time

def install_gdrive():
    """Install gdrive command-line tool"""
    print("Installing gdrive...")
    try:
        # Download gdrive
        subprocess.run(['wget', 'https://github.com/prasmussen/gdrive/releases/download/2.1.1/gdrive_2.1.1_linux_386.tar.gz'], check=True)
        subprocess.run(['tar', '-xzf', 'gdrive_2.1.1_linux_386.tar.gz'], check=True)
        subprocess.run(['chmod', '+x', 'gdrive'], check=True)
        print("gdrive installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error installing gdrive: {e}")
        return False

def upload_file(file_path):
    """Upload file to Google Drive"""
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return False
    
    print(f"Uploading {file_path} to Google Drive...")
    
    try:
        # Upload the file
        result = subprocess.run(['./gdrive', 'upload', file_path], 
                              capture_output=True, text=True, check=True)
        
        print("Upload successful!")
        print("Output:", result.stdout)
        
        # Extract the file ID and link from the output
        lines = result.stdout.split('\n')
        for line in lines:
            if 'https://drive.google.com' in line:
                print(f"\n🎉 Download Link: {line.strip()}")
                return line.strip()
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error uploading file: {e}")
        print("Error output:", e.stderr)
        return False

def main():
    print("=== Google Drive Upload Script ===")
    
    # Check if gdrive exists, if not install it
    if not os.path.exists('./gdrive'):
        if not install_gdrive():
            print("Failed to install gdrive")
            return
    
    # File to upload
    file_path = 'call-center-dashboard.zip'
    
    # Upload the file
    success = upload_file(file_path)
    
    if success:
        print("\n✅ File uploaded successfully!")
        print("📋 Check the output above for the download link")
    else:
        print("\n❌ Upload failed")
        print("💡 Alternative: You can manually upload the file from /home/z/my-project/call-center-dashboard.zip")

if __name__ == '__main__':
    main()