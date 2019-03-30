<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       astralbrands.com
 * @since      1.0.0
 *
 * @package    Astral_Integrations
 * @subpackage Astral_Integrations/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Astral_Integrations
 * @subpackage Astral_Integrations/includes
 * @author     Astral Brands <webdeveloper@astralbrands.com>
 */
class Astral_Integrations_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'astral-integrations',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
