<?php
/*
  Example:

  $input_json = ('[
  {
    "site_id": "8a458880-8eac-11e5-b008-0db303db092c",
    "article_id": "f8bac590-51c0-11e7-a8d3-005056877cea",
    "wordpress_id": 511245,
    "article_url": "https://dominio.com/la-depresion-un-reto-que-no-conoce-de-edades-broken-url/",
    "error_link": "/Users/elena/Downloads/Dialnet-AutoestimaYDepresionEnNinos-2385363.pdf",
    "without_https": "TRUE",
    "malformed_url": "TRUE"
  },
  {
    "site_id": "8a458880-8eac-11e5-b008-0db303db092c",
    "article_id": "f8bac590-51c0-11e7-a8d3-005056877cea",
    "wordpress_id": 511242,
    "article_url": "https://dominio.com/nasil-daha-iyi-kararlar-verebiliriz-broken-url/",
    "error_link": "https://dominio.com/tr\\n/saglik/spor-psikolojisi/vucudunuzu-degistirmeyi-engelleyen-6-zihinsel-problem/",
    "without_https": "TRUE",
    "malformed_url": "TRUE"
  },{
    "site_id": "29d9cb00-94ec-11e5-1273-300103476a32",
    "article_id": "8284b0a0-d684-11e6-ade7-60e3271f5155",
    "wordpress_id": 121061,
    "article_url": "https://dominio.com/beneficios-los-banos-vinagre/",
    "error_link": "http://Usos domésticos para el vinagre",
    "without_https": "TRUE",
    "malformed_url": "TRUE"
  },{
    "site_id": "29d9cb00-94ec-11e5-1273-300103476a32",
    "article_id": "8284b0a0-d684-11e6-ade7-60e3271f5155",
    "wordpress_id": 511248,
    "article_url": "https://dominio.com/guia-the-eye-of-…gment-broken-url/",
    "error_link": "www.dominio.com",
    "without_https": "TRUE",
    "malformed_url": "TRUE"
  }
	]');

*/

$domain = get_bloginfo('url');
$input_json = json_decode('INPUT_YOUR_JSON_HERE');
$report = array();

function get_post_link( $post_name ) {
  if ( !empty( $post_name ) ) {
      $main_url = get_bloginfo('url');
      return $main_url . '/' . $post_name . '/';
  }
}

foreach ($input_json as $post_data) {
  $has_error = preg_match('#' . $domain . '#', $post_data->article_url);

  if ($has_error) {
    $post_id = isset($post_data) ? $post_data->wordpress_id : '0';
    echo "post_id: {$post_id}\n";
    $content_post = get_post($post_id);
    if (!empty($content_post->post_content)) {

      $content = $content_post->post_content;
      $content = apply_filters('the_content', $content);
      $content = str_replace(']]>', ']]&gt;', $content);
      $pattern_error = [
        '/["]https:\/\/([a-z0-9-_\/]*).com([^ ]*)["]/',
        // https://dominio.com/fr\\n/sante/quels-sont-les-avantages-des-noix/ => https://dominio.com/fr/sante/quels-sont-les-avantages-des-noix/
        '/"(?:https?:(?:\/{1,2}))(\w+ .+?)"/',
        // http://Usos domésticos para el vinagre => https://dominio.as.com/usos-domesticos-vinagre/
        '/href="www/',
        // href="www.dominio.com" => href="https://www.dominio.com"
        '/<a href="(file:\/\/|.*\/Users\/.*.pdf)"(.*)>(.*)<\/a>/'
        // <a href="file//c:/document.pdf">sample text</a> => sample text
      ];

      if (preg_match_all($pattern_error[0], $content, $matches)) {
        foreach ($matches[0] as $link) {
          $new_link = str_replace("\n", "", $link);
          $content = str_replace($link, $new_link, $content);
          $content_post->post_content = $content;
          wp_update_post($content_post);

          if ($was_updated) {
            echo "update: {$post_id} error 1\n";
          }
        }
      }

      if (preg_match_all($pattern_error[1], $content, $matches)) {
        foreach ($matches[0] as $link) {
          $post_title = str_replace(array('"', 'http://', 'https://'), '', $link);
          $post = get_page_by_title( $post_title, OBJECT, 'post' );
          $status = 'pending';
          $permalink = '';
          if ( !empty( $post ) ) {
            $permalink = get_post_link( $post->post_name );
            $content = str_replace('http://' . $post_title, $permalink,  $content);
            $content_post->post_content = $content;
            $was_updated = wp_update_post($content_post);
            if ( $was_updated ) {
              $status = 'updated';
            }
          }
          $report[] = array(
            'domain' => $domain,
            'post_id' => $post_id,
            'post_link' => $domain . '?p=' . $post_id,
            'status' => $status,
            'error_link' => str_replace( '"', '', $link ),
            'new_link' => $permalink,
            'date' => date('Y-m-d')
          );
        }
      }

      if (preg_match_all($pattern_error[2], $content, $matches)) {
        $content_post->post_content = preg_replace('/href="www/msi', 'href="https://www', $content);
        wp_update_post($content_post);
        if ($was_updated) {
          echo "update: {$post_id} error 3\n";
        }
      }
      if (preg_match_all($pattern_error[3], $content, $matches)) {
        foreach ($matches[0] as $link) {
          $content_post->post_content = str_replace($link, $matches[3][0], $content);
          wp_update_post($content_post);
          if ($was_updated) {
            echo "update: {$post_id} error 4\n";
          }
        }
      }
    }
  }
}

// Return JSON report to check the changes with Google Spreadsheets
if ( !empty( $report ) ) {
  echo json_encode( $report );
}