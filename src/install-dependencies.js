import { execSync } from "child_process"

console.log("Installing missing dependencies...")

try {
  // Install lucide-react and other potentially missing packages
  execSync("npm install lucide-react class-variance-authority clsx tailwind-merge next-themes", { stdio: "inherit" })

  // Install additional UI component dependencies
  execSync("npm install @radix-ui/react-dropdown-menu @radix-ui/react-slot", { stdio: "inherit" })

  console.log("\nDependencies installed successfully!")
} catch (error) {
  console.error("Error installing dependencies:", error.message)
}

