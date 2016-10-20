class WrittenResultsController < ApplicationController
	def index
		@data=WrittenResult.all
	end
end
