<form role="search" method="get" id="searchform" class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label class="screen-reader-text" for="s"><?php _x( 'Search for:', 'label' ); ?></label>
  <div class="input-group">
    <input class="form-control" type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" placeholder="Search..."/>
    <span class="input-group-btn">
      <button class="btn btn-default" type="submit" id="searchsubmit" title="<?php echo esc_attr_x( 'Search', 'submit button' ); ?>"><i class="glyphicon glyphicon-search"> </i></button>
    </span>
  </div><!-- /input-group -->
</form>

