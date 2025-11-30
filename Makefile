.PHONY: help dev-up dev-down dev-logs prod-build prod-up prod-down logs clean

help:
	@echo "Available commands:"
	@echo "  make dev-up       - Start development environment"
	@echo "  make dev-down     - Stop development environment"
	@echo "  make dev-logs     - Show development logs"
	@echo "  make prod-build   - Build production image"
	@echo "  make prod-up      - Start production environment"
	@echo "  make prod-down    - Stop production environment"
	@echo "  make logs         - Show production logs"
	@echo "  make clean        - Remove all containers and volumes"

dev-up:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "App: http://localhost:3000"
	@echo "PostgreSQL: localhost:5423"

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f app

prod-build:
	docker-compose build --no-cache

prod-up:
	docker-compose up -d
	@echo "Production environment started!"
	@echo "App: http://localhost:3000"

prod-down:
	docker-compose down

logs:
	docker-compose logs -f app

clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	@echo "Cleanup complete!"
