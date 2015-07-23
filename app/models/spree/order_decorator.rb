Spree::Order.class_eval do
  def confirmation_required?
    return true
  end
end