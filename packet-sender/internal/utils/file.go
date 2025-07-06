package utils

import (
	"io"
	"os"
	"path/filepath"
)

// CopyDir copies a directory recursively from src to dst
func CopyDir(src string, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		
		// Skip .git directories and files
		if info.Name() == ".git" {
			return filepath.SkipDir
		}
		
		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		
		targetPath := filepath.Join(dst, relPath)
		
		if info.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}
		
		// Copy file
		return copyFile(path, targetPath, info.Mode())
	})
}

func copyFile(src, dst string, perm os.FileMode) error {
	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()
	
	dstFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer dstFile.Close()
	
	_, err = io.Copy(dstFile, srcFile)
	if err != nil {
		return err
	}
	
	return dstFile.Chmod(perm)
}

func FileExists(path string) bool {
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

func CreateDirIfNotExists(path string) error {
	if !FileExists(path) {
		return os.MkdirAll(path, 0755)
	}
	return nil
}