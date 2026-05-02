import { Log } from "./index";

async function testLogging() {
  process.stdout.write("Testing logger...\n");
  await Log("frontend", "info", "middleware", "Logging middleware initialized successfully");
  process.stdout.write("Log sent successfully!\n");
}

testLogging();
