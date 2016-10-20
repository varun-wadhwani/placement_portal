 class SessionsController < ApplicationController
	include SessionsHelper  
def new

  end
def create
     user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
        log_in user
      redirect_to user_info_index_path

      
    else
             flash[:danger] = 'Invalid email/password combination' # Not quite right!
      render 'new'
    end
  end
def destroy
     session[:user_id] = nil
    redirect_to users_path
 
  end


end
