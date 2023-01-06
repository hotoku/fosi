VERSION := NODATA


.PHONY: release
release: tree-clean check-version
	npm run bump $(VERSION)
	npm run build
	git tag v$(VERSION)
	git push --tag
	npm run release


.PHONY: check-version
check-version:
	@if [[ "$(VERSION)" = NODATA ]]; then echo "Error: VERSION is not given."; false; fi


.PHONY: tree-clean
tree-clean:
	@if [ $$(git status -s | wc -l) -ge 1 ]; then echo "Error: local tree is dirty."; false; fi
