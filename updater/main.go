package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

const (
	repoOwner = "HyperloopUPV-H8"
	repoName  = "software"
)

func main() {
	// Detect the operating system
	osType := detectOS()

	// Check if the `../backend/` folder exists
	if _, err := os.Stat("../backend"); err == nil {
		fmt.Println("Directory '../backend' found. Updating from the repository...")
		updateFromGit()
	} else {
		fmt.Println("Directory '../backend' not found. Checking binaries...")
		updateFromBinaries(osType)
	}
}

func detectOS() string {
	switch runtime.GOOS {
	case "windows":
		return "backend-windows-64"
	case "darwin":
		if strings.Contains(runtime.GOARCH, "arm") {
			return "backend-macos-m1-64"
		}
		return "backend-macos-64"
	case "linux":
		return "backend-linux-64"
	default:
		fmt.Fprintf(os.Stderr, "Unsupported operating system: %s\n", runtime.GOOS)
		os.Exit(1)
		return ""
	}
}

func updateFromGit() {
	// Run `git pull` in the `../backend` folder
	cmd := exec.Command("git", "-C", "../backend", "pull")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error running git pull: %v\n", err)
		os.Exit(1)
	}
	// Run `go mod tidy` to update dependencies
	cmd = exec.Command("go", "mod", "tidy")
	cmd.Dir = "../backend"
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error running go mod tidy: %v\n", err)
		os.Exit(1)
	}

	// Run `go build` in the `../backend` folder
	cmd = exec.Command("go", "build", "-o", "../backend/cmd/cmd.exe", "../backend/cmd/...")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error running go build: %v\n", err)
		os.Exit(1)
	}

	// Launch the compiled executable
	launchExecutable("../backend/cmd/cmd")
}

func updateFromBinaries(osType string) {
	// Search for and delete old binaries in the same directory as updater.exe
	binaries := []string{"backend-windows-64", "backend-linux-64", "backend-macos-64", "backend-macos-m1-64"}
	for _, binary := range binaries {
		if _, err := os.Stat("./" + binary); err == nil {
			fmt.Printf("Deleting old binary: %s\n", binary)
			if err := os.Remove("./" + binary); err != nil {
				fmt.Fprintf(os.Stderr, "Error deleting old binary: %v\n", err)
			}
		}
	}

	// Get the latest version from GitHub
	latestVersion, err := getLatestVersion()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error getting the latest version: %v\n", err)
		os.Exit(1)
	}

	fileName := osType
	if runtime.GOOS == "windows" {
		fileName += ".exe"
	}

	url := fmt.Sprintf("https://github.com/%s/%s/releases/download/v%s/%s", repoOwner, repoName, latestVersion, fileName)
	fmt.Printf("Downloading binary from: %s\n", url)

	// Download the binary directly to the file
	err = downloadFile("./"+fileName, url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error downloading the binary: %v\n", err)
		os.Exit(1)
	}

	// Make the binary executable
	if err := os.Chmod("./"+fileName, 0755); err != nil {
		fmt.Fprintf(os.Stderr, "Error making the binary executable: %v\n", err)
		os.Exit(1)
	}

	// Launch the downloaded binary
	launchExecutable("./" + fileName)
}

func downloadFile(filepath string, url string) error {
	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	return err
}

func getLatestVersion() (string, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", repoOwner, repoName)
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var release struct {
		TagName string `json:"tag_name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return "", err
	}

	return strings.TrimPrefix(release.TagName, "v"), nil
}

func launchExecutable(path string) {
	if runtime.GOOS == "windows" && !strings.HasSuffix(path, ".exe") {
		path += ".exe"
	}

	absPath, err := filepath.Abs(path)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error getting the absolute path: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Launching executable: %s\n", absPath)

	cmd := exec.Command(absPath)
	cmd.Dir = filepath.Dir(absPath)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error launching the executable: %v\n", err)
		os.Exit(1)
	}
}
