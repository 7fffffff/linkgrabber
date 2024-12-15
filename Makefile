# Phony targets declaration
.PHONY: all help clean build watch package lint

# Default target
all: build

# Show help
help:
	@echo "Available commands:"
	@echo "  make help     - Show this help message"
	@echo "  make all      - Build the project (default)"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make build    - Build the project"
	@echo "  make watch    - Watch for changes and rebuild"
	@echo "  make package  - Create distribution package"
	@echo "  make lint     - Run ESLint"

# Clean build artifacts
clean:
	rm -rf js dist

# Build the project
build: clean
	npm run build

# Watch for changes
watch: clean
	npm run watch

# Create distribution package
package: build
	mkdir -p dist
	zip -x\*.DS_Store dist/linkgrabber.zip -r css html images js vendor manifest.json

# Lint source code
lint:
	npm exec eslint src
