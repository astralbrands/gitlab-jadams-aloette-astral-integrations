<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       astralbrands.com
 * @since      1.0.0
 *
 * @package    Astral_Integrations
 * @subpackage Astral_Integrations/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Astral_Integrations
 * @subpackage Astral_Integrations/public
 * @author     Astral Brands <webdeveloper@astralbrands.com>
 */
class Astral_Integrations_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

	}

	public function enqueue_gtm() {
		if ( function_exists( 'gtm4wp_the_gtm_tag' ) ) { gtm4wp_the_gtm_tag(); }
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script( $this->plugin_name . '-footer', plugin_dir_url( __FILE__ ) . 'js/astral-integrations-event-parser.js', array('jquery'), $this->version, true);

		if( is_front_page() ) {

		}
		//Dynamic Yield
		wp_enqueue_script( $this->plugin_name . '-dynamicyield-dynamic', '//cdn.dynamicyield.com/api/8769269/api_dynamic.js', array(), $this->version, false );
		wp_enqueue_script( $this->plugin_name . 'dynamicyield-static', '//cdn.dynamicyield.com/api/8769269/api_static.js', array(), $this->version, false );
	}
	
	/**
	 * [xhr_hook description]
	 * @return [type] [description]
	 */
	public function xhr_hook() {
		include ('partials/astral-integrations-xhr-hook.php');
	}

	public function purchase_hook() {
		include ('partials/astral-integrations-purchase-hook.php');
	}
}
