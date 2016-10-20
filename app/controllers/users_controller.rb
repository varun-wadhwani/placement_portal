class UsersController < ApplicationController
    before_action :logged_in_user, only: [:edit, :update]
     before_action :correct_user,   only: [:edit, :update]


  # GET /users
  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
  @user = User.find(params[:id])
 redirect_to register_confirm_index_path
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
      
     @user = User.new(user_params)
    if @user.save
      
      flash[:success] = "Welcome to the Sample App!"
      redirect_to @user
    else
      render 'new'
    end
end

def edit
    @user = User.find(params[:id])
  end

def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      redirect_to @user

      # Handle a successful update.
    else
      render 'edit'
    end

  end





  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit!
    end

def logged_in_user
      unless logged_in?
       store_location
        flash[:danger] = "Please log in."
        redirect_to login_url
      end
    end

def correct_user
      @user = User.find(params[:id])
             redirect_to(root_url) unless current_user?(@user)

    end
 
end 

