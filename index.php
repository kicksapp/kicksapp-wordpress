<?php
// WordPress view bootstrapper
define( 'WP_USE_THEMES', true );

set_include_path(get_include_path() . PATH_SEPARATOR . __DIR__ . '/vendor/lib');
require_once('./vendor/lib/autoload_52.php');
require('./wp/wp-blog-header.php' );

?>