
Spree::CheckoutController.class_eval do
layout 'spree/layouts/spree_checkout'

  # Updates the order and advances to the next state (when possible.)
  def update

    if @order.update_from_params(params, permitted_checkout_attributes, request.headers.env)
      @order.temporary_address = !params[:save_user_address]
      unless @order.next
        flash[:error] = @order.errors.full_messages.join("\n")
        redirect_to checkout_state_path(@order.state) and return
      end
      if @order.completed?
        @current_order = nil
        flash.notice = Spree.t(:order_processed_successfully)
        flash['order_completed'] = true
        redirect_to completion_route
      else
        respond_to do |format|
          format.html { redirect_to checkout_state_path(@order.state) }
          format.js {render :layout => false }
        end
      end
    else

      respond_to do |format|
        format.html {render :edit}
        format.js {render :edit, :layout => false}
      end

    end
  end

  def edit
    respond_to do |format|
      format.html {}
      format.js {render :layout => false}
    end
  end
end