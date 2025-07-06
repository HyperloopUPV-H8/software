package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	cfgFile string
	verbose bool
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "packet-sender",
	Short: "Professional Hyperloop board simulator with interactive CLI",
	Long: `A professional packet sender that simulates real board behavior for the Hyperloop H10 project.

By default, starts in interactive mode for manual packet control.

Features:
- Interactive CLI for manual packet sending
- Random packet generation with configurable intervals
- Custom packet sending with specific values
- Protection packet simulation (faults, warnings, ok)
- Dual protocol support (TCP for protections/keepalive, UDP for data)
- Real-time monitoring and statistics

Available commands:
- packet-sender             (starts interactive mode)
- packet-sender run         (automatic simulation mode)
- packet-sender list        (list boards and packets)
- packet-sender send        (send individual packets)
- packet-sender interactive (explicit interactive mode)

Perfect for testing the backend transport layer without physical hardware.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		// If no subcommand is provided, run interactive mode
		return runInteractive(cmd, args)
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	// Global flags
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.packet-sender.yaml)")
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "verbose output")
	
	// Root command flags (for interactive mode)
	rootCmd.Flags().StringVar(&interactiveBoard, "board", "", "specific board to use (default: prompt for selection)")
	
	// Bind flags to viper
	viper.BindPFlag("verbose", rootCmd.PersistentFlags().Lookup("verbose"))
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Find home directory.
		home, err := os.UserHomeDir()
		cobra.CheckErr(err)

		// Search config in home directory with name ".packet-sender" (without extension).
		viper.AddConfigPath(home)
		viper.AddConfigPath(".")
		viper.SetConfigType("yaml")
		viper.SetConfigName(".packet-sender")
	}

	viper.AutomaticEnv() // read in environment variables that match

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err == nil {
		if verbose {
			fmt.Fprintln(os.Stderr, "Using config file:", viper.ConfigFileUsed())
		}
	}
}