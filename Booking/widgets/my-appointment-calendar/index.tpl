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


<div class="sesapmt_mini_calendar sesapmt_myappointments_calendar">
  <div class="sesapmt_mini_calendar_header">
    <a href="" class="leftbtn"><i class="fa fa-angle-left"></i></a>
    <a href="" class="rightbtn"><i class="fa fa-angle-right"></i></a>
    <span>July, 2017</span>
  </div>
  <div class="sesapmt_mini_calendar_main">
    <table>
      <thead>
        <tr>
          <th>M</th>
          <th>T</th>
          <th>W</th>
          <th>T</th>
          <th>F</th>
          <th>S</th>
          <th>S</th>
        </tr>  
      </thead>
      <tbody>
        <tr>
          <td class="date disabled"><span>26</span></td>
          <td class="date disabled"><span>27</span></td>
          <td class="date disabled"><span>28</span></td>
          <td class="date disabled"><span>29</span></td>
          <td class="date disabled"><span>30</span></td>
          <td class="date"><a href="">1</a></td>
          <td class="date holiday"><span>2</span></td>
        </tr>
        <tr>
          <td class="date"><a href="">3</a></td>
          <td class="date"><a href="">4</a></td>
          <td class="date"><a href="">5</a></td>
          <td class="date isbooked"><a href="">6<i>10</i></a></td>
          <td class="date isbooked"><a href="">7<i>1</i></a></td>
          <td class="date"><a href="">8</a></td>
          <td class="date holiday"><span>9</span></td>
        </tr>
        <tr>
          <td class="date"><a href="">10</a></td>
          <td class="date"><a href="">11</a></td>
          <td class="date"><a href="">12</a></td>
          <td class="date isbooked"><a href="">13<i>2</i></a></td>
          <td class="date"><a href="">14</a></td>
          <td class="date"><a href="">15</a></td>
          <td class="date holiday"><span>16</span></td>
        </tr>
        <tr>
          <td class="date "><a href="">17</a></td>
          <td class="date"><a href="">18</a></td>
          <td class="date isbooked"><a href="">19<i>1</i></a></td>
          <td class="date"><a href="">20</a></td>
          <td class="date"><a href="">21</a></td>
          <td class="date"><a href="">22</a></td>
          <td class="date holiday"><span>23</span></td>
        </tr>
        <tr>
          <td class="date"><a href="">24</a></td>
          <td class="date"><a href="">25</a></td>
          <td class="date"><a href="">26</a></td>
          <td class="date"><a href="">27</a></td>
          <td class="date"><a href="">28</a></td>
          <td class="date"><a href="">29</a></td>
          <td class="date holiday"><span>30</span></td>
        </tr>
        <tr>
          <td class="date"><a href="">31</a></td>
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
      