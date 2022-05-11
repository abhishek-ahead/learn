<?php

class Booking_Model_Userpayrequest extends Core_Model_Item_Abstract {
	protected $_searchTriggers = false;
  protected $_modifiedTriggers = false;
  protected $_user;
  protected $_gateway;
  protected $_source;
	// Booking
	public function onOrderRefund(){
	if( $this->state == 'pending' ) {
			$this->state = 'refunded';
		}
		$this->save();
		return $this;
	}
	public function onOrderPending()
	{
		if( $this->state == 'pending' ) {
			$this->state = 'pending';
		}
		$this->save();
		return $this;
	}
	public function onOrderCancel()
	{
		if( $this->state == 'pending' ) {
			$this->state = 'cancelled';
		}
		$this->save();
		return $this;
	}

	public function onOrderFailure()
	{
		if( $this->state == 'pending' ) {
			$this->state = 'failed';
		}
		$this->save();
		return $this;
	}

	public function onOrderIncomplete()
	{
		if( $this->state == 'pending' ) {
			$this->state = 'incomplete';
		}
		$this->save();
		return $this;
	}

	public function onOrderComplete()
	{
		if( $this->state == 'pending' ) {
			$this->state = 'complete';
		}
		$this->save();
		return $this;
	}
}
