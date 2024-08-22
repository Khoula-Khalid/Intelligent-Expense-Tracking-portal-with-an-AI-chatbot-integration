from flask import Flask, render_template # type: ignore
import configparser

app = Flask(__name__)

# Read configuration from secrets.ini
config = configparser.ConfigParser()
config.read('secrets.ini')
bot_name = config['Bot']['bot_name']

@app.route('/')
def dashboard():
    return render_template('AIbot.jsx', bot_name=bot_name)

if __name__ == '__main__':
    app.run(debug=True)
