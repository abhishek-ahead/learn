<div id="professionalMySettings">
  <?php echo $this->settings->render($this); ?>
<div>
<script type="text/javascript">
    en4.core.runonce.add(function() {
        sesJqueryObject("#available-wrapper").css("display","none");
        mapLoad = false;
      initializeSesBookingMapList();
      });
</script>