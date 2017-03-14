/**
 * jquery.bcpmenu.js v0.0.1
 * Copyright 2015, Benjamin Chartier + Codrops
 *
 * Inspiration: jquery.dlmenu.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;( function( $, window, undefined ) {

	'use strict';

	// global
	var Modernizr = window.Modernizr, $body = $( 'body' );

	$.BCPMenu = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	// the options
	$.BCPMenu.defaults = {
		// classes for the animation effects
		animationClasses : { classin : 'bcp-animate-in-2', classout : 'bcp-animate-out-2' },
		// menu structure
		menuStruct: {},
		// callback: click a link that has a sub menu
		// el is the link element (li); name is the level name ; subNames is the array of names of the submenu; ev is the event obj
		onLevelClick : function( el, name, subNames, ev ) { return false; },
		// callback: click a link that does not have a sub menu
		// el is the link element (li); name is the level name ; subNames is the array of names of the submenu; ev is the event obj
		onLinkClick : function( el, name, subNames, ev ) { return false; }
	};

	$.BCPMenu.prototype = {
		_init : function( options ) {

			// options
			this.options = $.extend( true, {}, $.BCPMenu.defaults, options );

			// create the menu structure
			this._createMenu();
			
			// cache some elements and initialize some variables
			this._config();

			var animEndEventNames = {
					'WebkitAnimation' : 'webkitAnimationEnd',
					'OAnimation' : 'oAnimationEnd',
					'msAnimation' : 'MSAnimationEnd',
					'animation' : 'animationend'
				},
				transEndEventNames = {
					'WebkitTransition' : 'webkitTransitionEnd',
					'MozTransition' : 'transitionend',
					'OTransition' : 'oTransitionEnd',
					'msTransition' : 'MSTransitionEnd',
					'transition' : 'transitionend'
				};

			// animation end event name
			this.animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ] + '.dlmenu';
			// transition end event name
			this.transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ] + '.dlmenu',
			// support for css animations and css transitions
			this.supportAnimations = Modernizr.cssanimations,
			this.supportTransitions = Modernizr.csstransitions;

			this._initEvents();

		},
		_config : function() {
			this.$menu = this.$el.children( 'ul.bcp-menu' );
			this.$menuitems = this.$menu.find( 'li.bcp-clickable' );
			this.$back = this.$menu.find( 'li.bcp-back' );
		},
		_createMenu : function() {

			var mainMenuStruct = this.options.menuStruct.menu;

			var insertMenu = function(parentEl, menuStruct, parentMenuId) {

				var ul;
				if (typeof(menuStruct.id)==='undefined' || menuStruct.id === "") {
					menuStruct.id = Math.floor(Math.random()*Math.pow(16,16)).toString(16);
				}

				if (typeof(parentMenuId)==='undefined') {
					parentEl.append( '<ul class="bcp-menu bcp-menuopen" id="' + menuStruct.id + '"></ul>' );
					ul = parentEl.children("ul.bcp-menu:first");
				} else {
					parentEl.append( '<ul class="bcp-submenu" id="' + menuStruct.id + '"></ul>' );
					ul = parentEl.children("ul.bcp-submenu:first");
				}

				ul.append( '<li class="bcp-head"><span>' + menuStruct.title + '</span></li>' );

				if (typeof(parentMenuId)!=='undefined') {
					ul.append( '<li class="bcp-back bcp-clickable"><a href="#">Retour au niveau supérieur</a></li>' );
				}

				$.each( menuStruct.submenus, function(i, val) {
					ul.append( '<li class="bcp-clickable"><a href="#">' + val.title + '</a></li>' );
					if (typeof(val.submenus)!=='undefined' && val.submenus.length > 1 ) {
						var li = ul.children("li:last");
						insertMenu(li, val, menuStruct.id);
					}
				});
			};

			insertMenu(this.$el, mainMenuStruct);

		},
		_initEvents : function() {

			var self = this;

			this.$menuitems.on( 'click.dlmenu', function( event ) {
				
				event.stopPropagation();

				var $item = $(this),
					$submenu = $item.children( 'ul.bcp-submenu' );
				var subNames = [];

				if( ($item.hasClass("bcp-subviewopen")) ) {
					return false;
				} else if( $submenu.length > 0 ) {

					$submenu.find("li > a").each( function() {
						var name = $( this ).text();
						if(subNames.indexOf(name) == -1) {
							subNames.push(name);
						}
					});

					var $flyin = $submenu.clone().css( 'opacity', 0 ).insertAfter( self.$menu ),
						onAnimationEndFn = function() {
							self.$menu.off( self.animEndEventName ).removeClass( self.options.animationClasses.classout ).addClass( 'bcp-subview' );
							$item.addClass( 'bcp-subviewopen' ).parents( '.bcp-subviewopen:first' ).removeClass( 'bcp-subviewopen' ).addClass( 'bcp-subview' );
							$flyin.remove();
						};

					setTimeout( function() {
						$flyin.addClass( self.options.animationClasses.classin );
						self.$menu.addClass( self.options.animationClasses.classout );
						if( self.supportAnimations ) {
							self.$menu.on( self.animEndEventName, onAnimationEndFn );
						}
						else {
							onAnimationEndFn.call();
						}

						self.options.onLevelClick( $item, $item.children( 'a:first' ).text(), subNames, event );
					} );

					return false;

				}
				else {
					self.options.onLinkClick( $item, $item.children( 'a:first' ).text(), subNames, event );
				}

			} );

			this.$back.on( 'click.dlmenu', function( event ) {
				var $this = $( this ),
					$submenu = $this.parents( 'ul.bcp-submenu:first' ),
					$item = $submenu.parent(),

					$flyin = $submenu.clone().insertAfter( self.$menu );

				var onAnimationEndFn = function() {
					self.$menu.off( self.animEndEventName ).removeClass( self.options.animationClasses.classin );
					$flyin.remove();
				};

				setTimeout( function() {
					$flyin.addClass( self.options.animationClasses.classout );
					self.$menu.addClass( self.options.animationClasses.classin );
					if( self.supportAnimations ) {
						self.$menu.on( self.animEndEventName, onAnimationEndFn );
					}
					else {
						onAnimationEndFn.call();
					}

					$item.removeClass( 'bcp-subviewopen' );
					
					var $subview = $this.parents( '.bcp-subview:first' );
					if( $subview.is( 'li' ) ) {
						$subview.addClass( 'bcp-subviewopen' );
					}
					$subview.removeClass( 'bcp-subview' );
				} );

				var subNames = [];
				var parentMenuEl;
				
				if( $submenu.parents( 'ul.bcp-submenu:first' ).length > 0 ) {
					parentMenuEl = $submenu.parents( 'ul.bcp-submenu:first' );
				} else {
					parentMenuEl = $submenu.parents( 'ul.bcp-menu:first' );
				}

				parentMenuEl.find("li:not(.bcp-back) > a").each( function() {
					var name = $( this ).text();
					if(subNames.indexOf(name) == -1) {
						subNames.push(name);
					}
				});

				parentMenuEl.find("li.bcp-head > span").each( function() {
					var name = $( this ).text();
					if(subNames.indexOf(name) == -1) {
						subNames.push(name);
					}
				});

				self.options.onLevelClick( $item, $item.children( 'a:first' ).text(), subNames, event );

				return false;

			} );
		}
	};

	var logError = function( message ) {
		if ( window.console ) {
			window.console.error( message );
		}
	};

	$.fn.dlmenu = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'dlmenu' );
				if ( !instance ) {
					logError( "cannot call methods on dlmenu prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for dlmenu instance" );
					return;
				}
				instance[ options ].apply( instance, args );

				instance.openMenu();
			});
		} 
		else {
			this.each(function() {	
				var instance = $.data( this, 'dlmenu' );
				if ( instance ) {
					instance._init();
				}
				else {
					instance = $.data( this, 'dlmenu', new $.BCPMenu( options, this ) );
				}
			});
		}
		return this;
	};

} )( jQuery, window );