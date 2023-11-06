
.PHONY: common-front-deps
common-front-deps:
	@echo "" && \
	echo "#=========================================#" && \
	echo "|   Updating common front dependencies    |" && \
	echo "#=========================================#" && \
	echo ""
	@cd common-front && npm install

common-front: common-front-deps
	@echo "" && \
	echo "#============================#" && \
	echo "|   Building common front    |" && \
	echo "#============================#" && \
	echo ""
	@cd common-front && npm run build

.PHONY: ethernet-view-deps
ethernet-view-deps:
	@echo "" && \
	echo "#==========================================#" && \
	echo "|   Updating ethernet view dependencies    |" && \
	echo "#==========================================#" && \
	echo ""
	@cd ethernet-view && npm install

ethernet-view: common-front ethernet-view-deps
	@echo "" && \
	echo "#=============================#" && \
	echo "|   Building ethernet view    |" && \
	echo "#=============================#" && \
	echo ""
	@cd ethernet-view && npm run build

.PHONY: control-station-deps
control-station-deps:
	@echo "" && \
	echo "#============================================#" && \
	echo "|   Updating control station dependencies    |" && \
	echo "#============================================#" && \
	echo ""
	@cd control-station && npm install

control-station: common-front control-station-deps
	@echo "" && \
	echo "#===============================#" && \
	echo "|   Building control station    |" && \
	echo "#===============================#" && \
	echo ""
	@cd control-station && npm run build

.PHONY: backend-tidy
backend-tidy:
	@echo "" && \
	echo "#==============================#" && \
	echo "|   Updating backend module    |" && \
	echo "#==============================#" && \
	echo ""
	@cd backend && go mod tidy

backend: backend-tidy
	@echo "" && \
	echo "#=======================#" && \
	echo "|   Building backend    |" && \
	echo "#=======================#" && \
	echo ""
	@cd backend && go build -C cmd -o backend

release-ethernet-view: backend ethernet-view
	@echo "" && \
	echo "#=====================================#" && \
	echo "|   Creating ethernet view release    |" && \
	echo "#=====================================#" && \
	echo ""
	mkdir -p build/ethernet-view
	cp backend/cmd/backend build/ethernet-view/ethernet-view
	cp backend/examples/config/ethernet-view.toml build/ethernet-view/config.toml
	rm -r build/ethernet-view/static
	cp -r ethernet-view/static build/ethernet-view/static
