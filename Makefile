# Cleanup
clean_vscode:
	rm -rf .vscode

clean: clean_vscode

# Testing
test:
	python3 -m http.server

# Pwny
.PHONY: clean clean_vscode \
test
