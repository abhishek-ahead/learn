<?php

/**
 * SocialEngineSolutions
 *
 * @category   Application_Booking
 * @package    Booking
 * @copyright  Copyright 2019-2020 SocialEngineSolutions
 * @license    http://www.socialenginesolutions.com/license/
 * @version    $Id: index.tpl  2019-03-19 00:00:00 SocialEngineSolutions $
 * @author     SocialEngineSolutions
 */
 
 ?>
<?php $this->headScript()->appendFile(Zend_Registry::get('StaticBaseUrl').'application/modules/Booking/externals/scripts/core.js'); ?>

<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Booking/externals/styles/styles.css'); ?>

<?php $this->headLink()->appendStylesheet($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/styles/customscrollbar.css'); ?>
<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/jquery.min.js'); ?>
<?php $this->headScript()->appendFile($this->layout()->staticBaseUrl . 'application/modules/Sesbasic/externals/scripts/customscrollbar.concat.min.js'); ?>

<div class="sesapmt_booking_popup sesbasic_bxs">
	<a href="javascript;" class="sesapmt_booking_popup_close_btn"><i class="fas fa-times"></i></a>
	<div class="sesapmt_booking_popup_inner">
  	<div class="sesapmt_booking_popup_header">
    	<div class="sesapmt_booking_popup_header_img">
      	<a href=""><span class="bg_item_photo" style="background-image:url(https://cdn.dribbble.com/users/4/avatars/normal/avatar.jpg);"></span></a>
      </div>
      <div class="sesapmt_booking_popup_header_info">
      	<p class="sesapmt_booking_popup_header_name"><a href=""><?php echo $this->translate('Meagan Fisher'); ?></a></p>
        <p class="sesapmt_booking_popup_header_tagline sesbasic_text_light"><?php echo $this->translate('Content Writing, Blog Writing'); ?></p>
      </div>
      <div class="sesapmt_booking_popup_header_btn">
				<a href="" class="sesapmt_btn_alt sesbasic_animation"><span><?php echo $this->translate('View Expert Profile'); ?></span></a>
      </div>
    </div>
    <div class="sesapmt_booking_popup_filters sesbasic_clearfix">
      <div class="selectbox selectbox_timtzone">
        <a href="javacript:void(0)" id="timezone_option_box"><?php echo $this->translate('Select Timezone'); ?></a>
        <select onchange="selecttimezone(this);">
          <option value="US/Pacific" selected="selected">(UTC-8) Pacific Time (US &amp; Canada)</option>
          <option value="US/Mountain">(UTC-7) Mountain Time (US &amp; Canada)</option>
          <option value="US/Central">(UTC-6) Central Time (US &amp; Canada)</option>
          <option value="US/Eastern">(UTC-5) Eastern Time (US &amp; Canada)</option>
          <option value="America/Halifax">(UTC-4)  Atlantic Time (Canada)</option>
          <option value="America/Anchorage">(UTC-9)  Alaska (US &amp; Canada)</option>
          <option value="Pacific/Honolulu">(UTC-10) Hawaii (US)</option>
          <option value="Pacific/Samoa">(UTC-11) Midway Island, Samoa</option>
          <option value="Etc/GMT-12">(UTC-12) Eniwetok, Kwajalein</option>
          <option value="Canada/Newfoundland">(UTC-3:30) Canada/Newfoundland</option>
          <option value="America/Buenos_Aires">(UTC-3) Brasilia, Buenos Aires, Georgetown</option>
          <option value="Atlantic/South_Georgia">(UTC-2) Mid-Atlantic</option>
          <option value="Atlantic/Azores">(UTC-1) Azores, Cape Verde Is.</option>
          <option value="Europe/London">Greenwich Mean Time (Lisbon, London)</option>
          <option value="Europe/Berlin">(UTC+1) Amsterdam, Berlin, Paris, Rome, Madrid</option>
          <option value="Europe/Athens">(UTC+2) Athens, Helsinki, Istanbul, Cairo, E. Europe</option>
          <option value="Europe/Moscow">(UTC+3) Baghdad, Kuwait, Nairobi, Moscow</option>
          <option value="Iran">(UTC+3:30) Tehran</option>
          <option value="Asia/Dubai">(UTC+4) Abu Dhabi, Kazan, Muscat</option>
          <option value="Asia/Kabul">(UTC+4:30) Kabul</option>
          <option value="Asia/Yekaterinburg">(UTC+5) Islamabad, Karachi, Tashkent</option>
          <option value="Asia/Calcutta">(UTC+5:30) Bombay, Calcutta, New Delhi</option>
          <option value="Asia/Katmandu">(UTC+5:45) Nepal</option>
          <option value="Asia/Omsk">(UTC+6) Almaty, Dhaka</option>
          <option value="India/Cocos">(UTC+6:30) Cocos Islands, Yangon</option>
          <option value="Asia/Krasnoyarsk">(UTC+7) Bangkok, Jakarta, Hanoi</option>
          <option value="Asia/Hong_Kong">(UTC+8) Beijing, Hong Kong, Singapore, Taipei</option>
          <option value="Asia/Tokyo">(UTC+9) Tokyo, Osaka, Sapporto, Seoul, Yakutsk</option>
          <option value="Australia/Adelaide">(UTC+9:30) Adelaide, Darwin</option>
          <option value="Australia/Sydney">(UTC+10) Brisbane, Melbourne, Sydney, Guam</option>
          <option value="Asia/Magadan">(UTC+11) Magadan, Soloman Is., New Caledonia</option>
          <option value="Pacific/Auckland">(UTC+12) Fiji, Kamchatka, Marshall Is., Wellington</option>
      </select>
        <script>
          function selecttimezone(sel){
            sesJqueryObject('#timezone_option_box').html(sel.options[sel.selectedIndex].text);
          }
        </script>
      </div>
      <div class="selectbox selectbox_service">
        <a href="javacript:void(0)" id="service_option_box"><?php echo $this->translate('Select Service'); ?></a>
        <select onchange="selectservice(this);">
          <option><?php echo $this->translate('Web Development'); ?></option>
          <option><?php echo $this->translate('Mobile App Development'); ?></option>
        </select>
        <script>
          function selectservice(sel){
            sesJqueryObject('#service_option_box').html(sel.options[sel.selectedIndex].text);
          }
        </script>
      </div>
    </div>
    <div class="sesapmt_booking_popup_cont">
      <div class="sesapmt_booking_popup_cont_left">
      	<p class="centerT"><?php echo $this->translate('Find time to meet Meagan Fisher'); ?></p>
      
      	<div class="sesapmt_mini_calendar sesapmt_mini_booking_calendar">
        	<div class="sesapmt_mini_calendar_header">
          	<a href="" class="leftbtn"><i class="fa fa-angle-left"></i></a>
            <a href="" class="rightbtn"><i class="fa fa-angle-right"></i></a>
          	<span>July, 2017</span>
          </div>
          <div class="sesapmt_mini_calendar_main">
          	<table>
            	<thead>
              	<tr>
                  <th><?php echo $this->translate('Mon'); ?></th>
                  <th><?php echo $this->translate('Tue'); ?></th>
                  <th><?php echo $this->translate('Wed'); ?></th>
                  <th><?php echo $this->translate('Thu'); ?></th>
                  <th><?php echo $this->translate('Fri'); ?></th>
                  <th><?php echo $this->translate('Sat'); ?></th>
                  <th><?php echo $this->translate('Sun'); ?></th>
                </tr>  
              </thead>
              <tbody>
              	<tr>
                	<td class="date disabled"><span>26</span></td>
                  <td class="date disabled"><span>27</span></td>
                  <td class="date disabled"><span>28</span></td>
                  <td class="date disabled"><span>29</span></td>
                  <td class="date disabled"><span>30</span></td>
                  <td class="date available"><a href="">1</a></td>
                  <td class="date holiday"><span>2</span></td>
                </tr>
              	<tr>
                	<td class="date available"><a href="">3</a></td>
                  <td class="date available"><a href="">4</a></td>
                  <td class="date available"><a href="">5</a></td>
                  <td class="date booked"><a href="">6</a></td>
                  <td class="date available"><a href="">7</a></td>
                  <td class="date available"><a href="">8</a></td>
                  <td class="date holiday"><span>9</span></td>
                </tr>
              	<tr>
                	<td class="date available"><a href="">10</a></td>
                  <td class="date"><a href="">11</a></td>
                  <td class="date"><a href="">12</a></td>
                  <td class="date booked"><a href="">13</a></td>
                  <td class="date available"><a href="">14</a></td>
                  <td class="date available"><a href="">15</a></td>
                  <td class="date holiday"><span>16</span></td>
                </tr>
              	<tr>
                  <td class="date "><a href="">17</a></td>
                  <td class="date available"><a href="">18</a></td>
                  <td class="date booked"><a href="">19</a></td>
                  <td class="date"><a href="">20</a></td>
                  <td class="date"><a href="">21</a></td>
                  <td class="date available"><a href="">22</a></td>
                  <td class="date holiday"><span>23</span></td>
                </tr>
              	<tr>
                  <td class="date"><a href="">24</a></td>
                  <td class="date"><a href="">25</a></td>
                  <td class="date"><a href="">26</a></td>
                  <td class="date current"><a href="">27</a></td>
                  <td class="date"><a href="">28</a></td>
                	<td class="date available"><a href="">29</a></td>
                  <td class="date holiday"><span>30</span></td>
                </tr>
              	<tr>
                	<td class="date available"><a href="">31</a></td>
                	<td class="date disabled"><span>1</span></td>
                  <td class="date disabled"><span>2</span></td>
                  <td class="date disabled"><span>3</span></td>
                  <td class="date disabled"><span>4</span></td>
                  <td class="date disabled"><span>5</span></td>
                  <td class="date disabled"><span>6</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>	
      </div>
      <div class="sesapmt_booking_popup_cont_right">
        <p class="centerT"><?php echo $this->translate('Select your suitable time slot'); ?></p>
        
        <div class="sesapmt_booking_popup_slots_container sesbasic_clearfix sesbasic_custom_scroll">
        	<div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">10:00 AM</a>
          </div>
        	<div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">11:00 AM</a>
          </div>
        	<div class="sesapmt_booking_popup_slot_item _notavailable">
          	<a href="#">12:00 PM</a>
          </div>
        	<div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">1:00 PM</a>
          </div>
        	<div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">2:00 PM</a>
          </div>
        	<div class="sesapmt_booking_popup_slot_item _notavailable">
          	<a href="#">3:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">4:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">5:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">6:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">7:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">8:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">9:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">10:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">11:00 PM</a>
          </div>
          <div class="sesapmt_booking_popup_slot_item _isavailable">
          	<a href="#">12:00 AM</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
