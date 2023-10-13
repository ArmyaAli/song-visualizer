#####################################################################################################
#
#  Author: Ali Umar
#  Date: 2023-10-09
#  Version: 0.1
#
#####################################################################################################

SETUP_DIRS= test app/lib

.PHONY: run setup

run: 
	@echo Creating\ a\ http\ server\ at\ the\ following\ endpoint:\ http://localhost:8000\ with\ app/\ as\ base_path 
	@cd app; http-server -p 8000 -c-1 -o .
setup: 
	@echo Creating\ the\ following\ directories:\ $(SETUP_DIRS)
	@mkdir $(SETUP_DIRS)