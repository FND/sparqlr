.PHONY: dependencies

pure_version = 0.2.1
jquery_version = 2.0.3

download = \
	curl --output $(1) --time-cond $(1) --remote-time $(2); echo

dependencies:
	mkdir -p extlib
	$(call download, "extlib/pure.css", \
		"http://yui.yahooapis.com/pure/$(pure_version)/pure-min.css")
	$(call download, "extlib/jquery.js", \
		"http://ajax.googleapis.com/ajax/libs/jquery/$(jquery_version)/jquery.min.js")
