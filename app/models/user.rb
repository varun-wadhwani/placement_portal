 class User < ActiveRecord::Base
       attr_accessor :remember_token 

  before_save { email.downcase! }
    
  validates :enrollment_number,presence: true
  validates :phone_number,presence: true
  validates :date_of_birth,presence: true
  validates :degree,presence: true
   
  validates :percentage_class_tenth,presence: true
  validates :percentage_class_twelfth,presence: true
  validates :cgpa,presence: true
   
  validates :current_sgpa,presence: true
  validates :current_log,presence: true
 
  validates :name, presence: true, length: { maximum: 50 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
has_secure_password
  validates :password, presence: true, length: { minimum: 6 },allow_nil: true
def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end
def User.new_token
    SecureRandom.urlsafe_base64
  end
def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end
  
 

   
 





private

    # Converts email to all lower-case.
    def downcase_email
      self.email = email.downcase
    end


 
end
