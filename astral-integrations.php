<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              astralbrands.com
 * @since             1.0.0
 * @package           Astral_Integrations
 *
 * @wordpress-plugin
 * Plugin Name:       Astral Integrations
 * Plugin URI:        https://git.astralbrands.com/jadams/wp-astral-integrations
 * Description:       This plugin is used to integrate astral brands 3rd party 
 *                    integrations into Aloettes WP Theme.
 * Version:           1.0.0
 * Author:            Astral Brands
 * Author URI:        astralbrands.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       astral-integrations
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-astral-integrations-activator.php
 */
function activate_astral_integrations() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-astral-integrations-activator.php';
	Astral_Integrations_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-astral-integrations-deactivator.php
 */
function deactivate_astral_integrations() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-astral-integrations-deactivator.php';
	Astral_Integrations_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_astral_integrations' );
register_deactivation_hook( __FILE__, 'deactivate_astral_integrations' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-astral-integrations.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_astral_integrations() {

	$plugin = new Astral_Integrations();
	$plugin->run();

}
run_astral_integrations();
