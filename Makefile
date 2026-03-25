.PHONY: ci ci-front ci-back

ci: ci-front ci-back

ci-front:
	cd pwa-client-v2 && npm run ci

ci-back:
	$(MAKE) -C laravel-api all
