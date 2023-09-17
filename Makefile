.PHONY: run
	
run: 
	cd app && http-server -p 8000 -c-1 -o .
