/*
* last update: 2006-08-24
*/

editAreaLoader.load_syntax["incra"] = {
	'DISPLAY_NAME' : 'incra'
	,'COMMENT_SINGLE' : {}
	,'COMMENT_MULTI' : {'<!--' : '-->'}
	,'QUOTEMARKS' : {1: "'", 2: '"'}
	,'KEYWORD_CASE_SENSITIVE' : false
	,'KEYWORDS' : {
		'attributes'	:	['Configuration','System']
		,'values' : [
			'absolute', 'block', 'bold', 'bolder', 'both' 	// etc...
		]
	}
	,'OPERATORS' :[
	]
	,'DELIMITERS' :['[',']'
	],
	'REGEXPS' : {
		'tags' : {
			'search' : '[*[\]]'
			,'class' : 'tags'
			,'modifiers' : 'gi'
			,'execute' : 'before' // before or after
		}
	}
	,'STYLES' : {
		'COMMENTS': 'color: #AAAAAA;'
		,'QUOTESMARKS': 'color: #6381F8;'
		,'KEYWORDS' : {
				'attributes' : 'background-color: #f5f5f5;'
				,'values' : 'background-color: #f5f5f5;'
			}
		,'OPERATORS' : ''
		,'DELIMITERS' : 'color: #E775F0;'
		,'REGEXPS' : {
			'attributes': 'background-color: #f5f5f5;'
		}
	}		
};
