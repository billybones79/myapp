Spree::OrdersController.class_eval do

  respond_to :js, :only => [:update]

  def index

    @orders = current_spree_user.orders.complete.order('completed_at desc')

    render :layout => 'spree/layouts/spree_user'

  end

  # Submit from header cart, /cart page
  def update


    if @order.contents.update_cart(order_params)

      respond_with(@order) do |format|
        format.html do
          if params.has_key?(:checkout)
            @order.next if @order.cart?
            redirect_to checkout_path
          else
            redirect_to cart_path
          end
        end
        format.js {}
      end
    else
      respond_with(@order)
    end
  end

  def empty
    if @order = current_order
      @order.empty!
    end

    respond_with(order) do |format|
      format.html { redirect_to spree.cart_path }
      format.js {}
    end
  end

  # Add to cart ajax
  def populate

    order    = current_order(create_order_if_necessary: true)
    variant  = Spree::Variant.find(params[:variant_id])
    quantity = params[:quantity].to_i
    options  = params[:options] || {}

    # 2,147,483,647 is crazy. See issue #2695.
    if quantity.between?(1, 2_147_483_647)
      begin
        order.contents.add(variant, quantity, options)
      rescue ActiveRecord::RecordInvalid => e
        error = e.record.errors.full_messages.join(", ")
      end
    else
      error = Spree.t(:please_enter_reasonable_quantity)
    end

    if error
      respond_to do |format|
        format.html {
          flash[:error] = error
          redirect_back_or_default(spree.root_path)
        }
        format.js {render :json => t("messages.add_to_cart_fail"), :status => 422}
      end
    else
      respond_with(order) do |format|
        format.html { redirect_to cart_path }
        format.js {}
      end
    end

  end

end