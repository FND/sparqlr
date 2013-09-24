/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

"use strict";

var form = $("form").on("submit", onSubmit);
var endpointField = $("input[name=endpoint]", form);
var queryField = $("textarea", form);
var inferField = $("input[name=infer]", form);
var results = $("#results");
var indicator = $("<p/ >").html("loading&hellip;").insertBefore(results).hide();

function onResponse(data, status, xhr) {
	var cols = $.map(data.head.vars, function(colName) {
		return $("<th />").text(colName)[0];
	});
	var header = $("<tr />").append(cols).wrap("<thead />").parent();

	var rows = $.map(data.results.bindings, function(result) {
		var cols = $.map(data.head.vars, function(colName) {
			var cell = $("<td />");
			var data = result[colName];
			if(data) {
				cell.text(stringify(data));
			}
			return cell[0];
		});
		return $("<tr />").append(cols)[0];
	});
	var body = $("<tbody />").append(rows);

	results.append(header, body);
}

function onSubmit(ev) {
	var endpoint = endpointField.val();
	var query = queryField.val();
	var infer = inferField.val();
	results.empty();
	sparql(endpoint, query, infer, onResponse);
	ev.preventDefault();
}

function sparql(endpoint, query, infer, callback) {
	var params = { query: query };
	if(infer) {
		params.infer = true;
	}
	$.ajax({
		type: "post",
		url: endpoint,
		beforeSend: function(xhr, settings) {
			xhr.setRequestHeader("Accept", "application/sparql-results+json");
			indicator.slideDown();
		},
		data: params,
		success: callback,
		complete: function() {
			indicator.slideUp();
		}
	});
}

function stringify(result) {
	var str;
	switch(result.type) {
	case "uri":
		str = "<" + result.value + ">";
		break;
	case "literal":
		str = '"' + result.value + '"';
		var lang = result["xml:lang"];
		if(lang) {
			str += "@" + lang;
		}
		break;
	case "typed-literal":
		var type = value.datatype.
			replace("http://www.w3.org/2001/XMLSchema#", "xsd:");
        str = result.value + "^^" + type;
		break;
	case "bnode":
        str = "_:" + result.value;
		break;
	default:
		str = result.toString();
		break;
	}
	return str;
}

}(jQuery));
