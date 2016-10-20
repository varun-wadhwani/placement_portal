class FinalResultsController < ApplicationController
	def index
		@data=FinalResult.all

	end
end
