class UserInfoController < ApplicationController
	def index
		@data = UserInfo.all

	end
end
