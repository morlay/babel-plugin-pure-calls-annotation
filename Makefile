fmt:
	pnpx prettier --write "src/**/*.{ts,tsx,json,md}"

build:
	tsc

test: install fmt
	pnpx jest --coverage

install:
	pnpm install

