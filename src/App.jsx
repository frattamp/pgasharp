import React, { useState, useEffect } from 'react'
import Terms from './Terms'
import Auth from './Auth'
import Landing from './Landing'
import { supabase } from './supabase'
import Chat from './Chat'
import BarPoolOptimizer from './BarPoolOptimizer'

const KEY = import.meta.env.VITE_DATAGOLF_KEY

function dgFetch(path, params = {}) {
  if (import.meta.env.DEV) {
    const q = new URLSearchParams({ ...params, key: KEY })
    return fetch(`/api/${path}?${q.toString()}`)
  }
  const q = new URLSearchParams({ ...params, path })
  return fetch(`/api/datagolf?${q.toString()}`)
}

function weatherFetch(params = {}) {
  const q = new URLSearchParams(params)
  if (import.meta.env.DEV) {
    return fetch(`/weather/v1/forecast?${q.toString()}`)
  }
  return fetch(`/api/weather?${q.toString()}`)
}

const flipName = (n) => {
  const p = n.split(', ')
  return p.length === 2 ? `${p[1]} ${p[0]}` : n
}

const countryFlag = (code) => {
  if (!code) return ''
  const flags = {
    'USA': '🇺🇸', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'SCO': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'WAL': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'IRL': '🇮🇪',
    'AUS': '🇦🇺', 'RSA': '🇿🇦', 'CAN': '🇨🇦', 'ESP': '🇪🇸', 'JPN': '🇯🇵',
    'KOR': '🇰🇷', 'GER': '🇩🇪', 'SWE': '🇸🇪', 'NOR': '🇳🇴', 'DEN': '🇩🇰',
    'FRA': '🇫🇷', 'BEL': '🇧🇪', 'ITA': '🇮🇹', 'ARG': '🇦🇷', 'COL': '🇨🇴',
    'CHI': '🇨🇱', 'NZL': '🇳🇿', 'CHN': '🇨🇳', 'TPE': '🇹🇼', 'AUT': '🇦🇹',
    'SUI': '🇨🇭', 'FIN': '🇫🇮', 'MEX': '🇲🇽', 'VEN': '🇻🇪', 'PUR': '🇵🇷',
    'NIR': '🇬🇧', 'ZIM': '🇿🇼', 'NAM': '🇳🇦', 'THA': '🇹🇭', 'IND': '🇮🇳',
    'POL': '🇵🇱', 'PHI': '🇵🇭', 'MAS': '🇲🇾', 'PAR': '🇵🇾', 'POR': '🇵🇹',
    'NED': '🇳🇱', 'CZE': '🇨🇿', 'FIJ': '🇫🇯',
  }
  return flags[code] || ''
}

const PLAYER_COUNTRIES = {
  // USA
  'Scottie Scheffler': 'USA', 'Xander Schauffele': 'USA', 'Collin Morikawa': 'USA',
  'Patrick Cantlay': 'USA', 'Wyndham Clark': 'USA', 'Tony Finau': 'USA',
  'Justin Thomas': 'USA', 'Jordan Spieth': 'USA', 'Max Homa': 'USA',
  'Keegan Bradley': 'USA', 'Sahith Theegala': 'USA', 'Chris Kirk': 'USA',
  'Rickie Fowler': 'USA', 'Russell Henley': 'USA', 'Brian Harman': 'USA',
  'Kurt Kitayama': 'USA', 'Denny McCarthy': 'USA', 'Eric Cole': 'USA',
  'Davis Riley': 'USA', 'Lucas Glover': 'USA', 'Harris English': 'USA',
  'Brendon Todd': 'USA', 'Sam Burns': 'USA', 'Billy Horschel': 'USA',
  'Will Zalatoris': 'USA', 'Kevin Kisner': 'USA', 'Webb Simpson': 'USA',
  'Bubba Watson': 'USA', 'Dustin Johnson': 'USA', 'Brooks Koepka': 'USA',
  'Bryson DeChambeau': 'USA', 'Phil Mickelson': 'USA', 'Tiger Woods': 'USA',
  'Matt Kuchar': 'USA', 'Kevin Streelman': 'USA', 'Zach Johnson': 'USA',
  'Steve Stricker': 'USA', 'Jim Furyk': 'USA', 'Ryan Palmer': 'USA',
  'Charley Hoffman': 'USA', 'Scott Stallings': 'USA', 'Harold Varner III': 'USA',
  'Talor Gooch': 'USA', 'Cameron Young': 'USA', 'Maverick McNealy': 'USA',
  'Beau Hossler': 'USA', 'Brendan Steele': 'USA', 'Kevin Na': 'USA',
  'Ryan Moore': 'USA', 'John Huh': 'USA', 'Chesson Hadley': 'USA',
  'Ryan Brehm': 'USA', 'Adam Svensson': 'USA', 'Scott Piercy': 'USA',
  'Pat Perez': 'USA', 'James Hahn': 'USA', 'Tyler Duncan': 'USA',
  'Joel Dahmen': 'USA', 'Patton Kizzire': 'USA', 'Andrew Putnam': 'USA',
  'Peter Malnati': 'USA', 'Hank Lebioda': 'USA', 'Mark Hubbard': 'USA',
  'Doug Ghim': 'USA', 'Richy Werenski': 'USA', 'Ben Griffin': 'USA',
  'Austin Eckroat': 'USA', 'Jake Knapp': 'USA', 'Nick Dunlap': 'USA',
  'Akshay Bhatia': 'USA', 'Luke Clanton': 'USA', 'Neal Shipley': 'USA',
  'Jackson Suber': 'USA', 'Pierceson Coody': 'USA', 'Michael Thorbjornsen': 'USA',
  'David Skinns': 'USA', 'Trace Crowe': 'USA', 'Ben Silverman': 'USA',
  'Hayden Buckley': 'USA', 'MJ Daffue': 'USA', 'Justin Lower': 'USA',
  'Nelson Ledesma': 'USA', 'Brandon Wu': 'USA', 'Harry Hall': 'USA',
  'Joseph Bramlett': 'USA', 'Michael Kim': 'USA', 'Danny Willett': 'ENG',
  'Nick Hardy': 'USA', 'Vince Whaley': 'USA', 'Sam Ryder': 'USA',
  'Taylor Moore': 'USA', 'Chandler Phillips': 'USA', 'David Lipsky': 'USA',
  'Zac Blair': 'USA', 'John Pak': 'USA', 'Bo Hoag': 'USA',
  'Chase Seiffert': 'USA', 'Kevin Roy': 'USA', 'Callum Tarren': 'ENG',
  'Adam Schenk': 'USA', 'Stephan Jaeger': 'GER', 'Chris Gotterup': 'USA',
  'Ben Martin': 'USA', 'Aaron Baddeley': 'AUS', 'Johnson Wagner': 'USA',
  'Bronson Burgoon': 'USA', 'Scott Brown': 'USA', 'Kramer Hickok': 'USA',
  'Martin Trainer': 'USA', 'Matt NeSmith': 'USA', 'Troy Merritt': 'USA',
  'Kevin Chappell': 'USA', 'Rod Pampling': 'AUS', 'John Senden': 'AUS',
  'Vaughn Taylor': 'USA', 'Bill Haas': 'USA', 'Brice Garnett': 'USA',
  'Will Gordon': 'USA', 'Ted Potter Jr': 'USA', 'Robert Streb': 'USA',
  'Alex Smalley': 'USA', 'Nate Lashley': 'USA', 'Danny Lee': 'NZL',
  'Joe Highsmith': 'USA', 'Adrien Saddier': 'FRA', 'Alejandro Tosti': 'ARG',
  // Northern Ireland
  'Rory McIlroy': 'NIR', 'Graeme McDowell': 'NIR', 'Darren Clarke': 'NIR',
  'Padraig Harrington': 'IRL',
  // England
  'Tommy Fleetwood': 'ENG', 'Tyrrell Hatton': 'ENG', 'Matt Fitzpatrick': 'ENG',
  'Lee Westwood': 'ENG', 'Justin Rose': 'ENG', 'Paul Casey': 'ENG',
  'Luke Donald': 'ENG', 'Eddie Pepperell': 'ENG', 'Andy Sullivan': 'ENG',
  'Chris Wood': 'ENG', 'Tom Lewis': 'ENG', 'Aaron Rai': 'ENG',
  'Callum Shinkwin': 'ENG', 'Richard Bland': 'ENG', 'Marcus Armitage': 'ENG',
  'Daniel Gavins': 'ENG', 'Jordan Smith': 'ENG', 'Matthew Jordan': 'ENG',
  'Jack Senior': 'ENG', 'Dale Whitnell': 'ENG', 'David Horsey': 'ENG',
  'Matt Wallace': 'ENG', 'Andrew Johnston': 'ENG', 'Oliver Wilson': 'ENG',
  'Nick Dougherty': 'ENG', 'Ross Fisher': 'ENG', 'Simon Dyson': 'ENG',
  // Scotland
  'Robert MacIntyre': 'SCO', 'Calum Hill': 'SCO', 'Martin Laird': 'SCO',
  'Russell Knox': 'SCO', 'Marc Warren': 'SCO', 'Stephen Gallacher': 'SCO',
  'David Drysdale': 'SCO', 'Craig Lee': 'SCO', 'Grant Forrest': 'SCO',
  'Ewen Ferguson': 'SCO', 'Connor Syme': 'SCO',
  // Ireland
  'Shane Lowry': 'IRL', 'Seamus Power': 'IRL', 'Pádraig Harrington': 'IRL',
  'Niall Kearney': 'IRL', 'Cormac Sharvin': 'IRL', 'Jonathan Caldwell': 'IRL',
  // Australia
  'Jason Day': 'AUS', 'Adam Scott': 'AUS', 'Min Woo Lee': 'AUS',
  'Cam Davis': 'AUS', 'Cameron Smith': 'AUS', 'Marc Leishman': 'AUS',
  'Lucas Herbert': 'AUS', 'Matt Jones': 'AUS', 'Aaron Baddeley': 'AUS',
  'Rod Pampling': 'AUS', 'John Senden': 'AUS', 'Brett Drewitt': 'AUS',
  'Brad Kennedy': 'AUS', 'Blake Windred': 'AUS', 'David Bransdon': 'AUS',
  'Rhein Gibson': 'AUS', 'Andrew Evans': 'AUS', 'Jake McLeod': 'AUS',
  'Travis Smyth': 'AUS', 'David McKenzie': 'AUS', 'Matthew Griffin': 'AUS',
  'Peter Wilson': 'AUS', 'James Nitties': 'AUS', 'Josh Younger': 'AUS',
  // Canada
  'Adam Hadwin': 'CAN', 'Corey Conners': 'CAN', 'Nick Taylor': 'CAN',
  'Taylor Pendrith': 'CAN', 'Mackenzie Hughes': 'CAN', 'Roger Sloan': 'CAN',
  'Michael Gligic': 'CAN', 'Stuart Macdonald': 'CAN', 'Ben Silverman': 'CAN',
  'Jared du Toit': 'CAN', 'Austin Connelly': 'CAN', 'David Hearn': 'CAN',
  'Graham DeLaet': 'CAN', 'Mike Weir': 'CAN', 'Stephen Ames': 'CAN',
  // South Korea
  'Sungjae Im': 'KOR', 'Si Woo Kim': 'KOR', 'Tom Kim': 'KOR',
  'Byeong Hun An': 'KOR', 'KH Lee': 'KOR', 'Joohyung Kim': 'KOR',
  'Seonghyeon Kim': 'KOR', 'Sangmoon Bae': 'KOR', 'Chan Kim': 'KOR',
  'Kyoung-Hoon Lee': 'KOR', 'Bio Kim': 'KOR', 'Seungyul Noh': 'KOR',
  // Japan
  'Hideki Matsuyama': 'JPN', 'Ryo Hisatsune': 'JPN', 'Keita Nakajima': 'JPN',
  'Rikuya Hoshino': 'JPN', 'Satoshi Kodaira': 'JPN', 'Yuta Ikeda': 'JPN',
  'Brendan Jones': 'AUS', 'Shaun Norris': 'RSA', 'Toshinori Muto': 'JPN',
  'Takumi Kanaya': 'JPN', 'Ryutaro Nagano': 'JPN', 'Kazuki Higa': 'JPN',
  // South Africa
  'Christiaan Bezuidenhout': 'RSA', 'Erik van Rooyen': 'RSA', 'Garrick Higgo': 'RSA',
  'Louis Oosthuizen': 'RSA', 'Branden Grace': 'RSA', 'Charl Schwartzel': 'RSA',
  'Ernie Els': 'RSA', 'Retief Goosen': 'RSA', 'Trevor Immelman': 'RSA',
  'Justin Harding': 'RSA', 'Jacques Blaauw': 'RSA', 'Hennie du Plessis': 'RSA',
  'Dean Burmester': 'RSA', 'Dylan Frittelli': 'RSA', 'Thriston Lawrence': 'RSA',
  'Aldrich Potgieter': 'RSA', 'Daan Huizing': 'NED', 'Wil Besseling': 'NED',
  // Spain
  'Jon Rahm': 'ESP', 'Sergio Garcia': 'ESP', 'Miguel Angel Jimenez': 'ESP',
  'Rafa Cabrera Bello': 'ESP', 'Pablo Larrazabal': 'ESP', 'Adri Arnaus': 'ESP',
  'Jorge Campillo': 'ESP', 'Ivan Ballesteros': 'ESP', 'Sebastian Garcia Rodriguez': 'ESP',
  // Norway
  'Viktor Hovland': 'NOR', 'Kristoffer Ventura': 'NOR', 'Torbjorn Erikson': 'NOR',
  // Sweden
  'Ludvig Aberg': 'SWE', 'Alex Noren': 'SWE', 'Henrik Stenson': 'SWE',
  'Sebastian Soderberg': 'SWE', 'Jesper Svensson': 'SWE', 'Joakim Lagergren': 'SWE',
  'Oscar Lengden': 'SWE', 'Per Langfors': 'SWE', 'Christofer Blomstrand': 'SWE',
  // Denmark
  'Nicolai Hojgaard': 'DEN', 'Rasmus Hojgaard': 'DEN', 'Thorbjorn Olesen': 'DEN',
  'Lucas Bjerregaard': 'DEN', 'Jeff Winther': 'DEN', 'Marcus Helligkilde': 'DEN',
  // Germany
  'Martin Kaymer': 'GER', 'Stephan Jaeger': 'GER', 'Alex Cejka': 'GER',
  'Maximilian Kieffer': 'GER', 'Marcel Schneider': 'GER', 'Hurly Long': 'GER',
  'Yannik Paul': 'GER', 'Matthias Schmid': 'GER',
  // Austria
  'Sepp Straka': 'AUT', 'Bernd Wiesberger': 'AUT', 'Matthias Schwab': 'AUT',
  // France
  'Victor Perez': 'FRA', 'Antoine Rozner': 'FRA', 'Adrien Saddier': 'FRA',
  'Romain Langasque': 'FRA', 'Benjamin Hebert': 'FRA', 'Clement Sordet': 'FRA',
  'Paul Barjon': 'FRA', 'Frederic Lacroix': 'FRA',
  // Belgium
  'Nicolas Colsaerts': 'BEL', 'Thomas Detry': 'BEL', 'Thomas Pieters': 'BEL',
  // Italy
  'Francesco Molinari': 'ITA', 'Renato Paratore': 'ITA', 'Edoardo Molinari': 'ITA',
  'Guido Migliozzi': 'ITA', 'Lorenzo Scalise': 'ITA', 'Andrea Pavan': 'ITA',
  // New Zealand
  'Ryan Fox': 'NZL', 'Danny Lee': 'NZL', 'Michael Hendry': 'NZL',
  'Mark Brown': 'NZL', 'Josh Geary': 'NZL',
  // Chile
  'Joaquin Niemann': 'CHI', 'Mito Pereira': 'CHI', 'Felipe Aguilar': 'CHI',
  'Hugo Leon': 'CHI',
  // Colombia
  'Sebastian Munoz': 'COL', 'Camilo Villegas': 'COL', 'Nicolas Echavarria': 'COL',
  'Jhonattan Vegas': 'VEN',
  // Mexico
  'Abraham Ancer': 'MEX', 'Carlos Ortiz': 'MEX', 'Roberto Diaz': 'MEX',
  'Rodolfo Cazaubon': 'MEX',
  // Argentina
  'Emiliano Grillo': 'ARG', 'Fabian Gomez': 'ARG', 'Alejandro Tosti': 'ARG',
  'Angel Cabrera': 'ARG',
  // China
  'Haotong Li': 'CHN', 'Ashun Wu': 'CHN', 'Tianlang Guan': 'CHN',
  // Taiwan
  'CT Pan': 'TPE', 'CV Lee': 'TPE',
  // Thailand
  'Kiradech Aphibarnrat': 'THA', 'Jazz Janewattananond': 'THA',
  'Pavit Tangkamolprasert': 'THA', 'Rattanon Wannasrichan': 'THA',
  // India
  'Anirban Lahiri': 'IND', 'Shubhankar Sharma': 'IND', 'Gaganjeet Bhullar': 'IND',
  'SSP Chawrasia': 'IND',
  // Zimbabwe
  'Brendon de Jonge': 'ZIM', 'Scott Vincent': 'ZIM',
  // Wales
  'Jamie Donaldson': 'WAL', 'Rhys Davies': 'WAL', 'Stuart Manley': 'WAL',
  'Ryan Evans': 'WAL', 'Liam Johnston': 'SCO',
  // Switzerland
  'Andre Romero': 'ARG', 'Joel Girrbach': 'SUI', 'Raphael Jacquelin': 'FRA',
  // Finland
  'Mikko Korhonen': 'FIN', 'Roope Kakko': 'FIN',
  // Puerto Rico
  'Rafael Campos': 'PUR', 'Juan Miguel Echevarria': 'PUR',
  // Namibia
  'Jovan Rebula': 'RSA',
  // Netherlands
  'Daan Huizing': 'NED', 'Wil Besseling': 'NED', 'Joost Luiten': 'NED',
  // Czech Republic
  'Ondrej Lieser': 'CZE',
  // Fiji
  'Vijay Singh': 'FIJ',
  // Venezuela
  'Jhonattan Vegas': 'VEN',
  // Additional players
  'JT Poston': 'USA', 'Keith Mitchell': 'USA', 'Trey Mullinax': 'USA',
  'Andrew Novak': 'USA', 'Bud Cauley': 'USA', 'Ryan Gerard': 'USA',
  'Jimmy Walker': 'USA', 'Danny Walker': 'USA', 'Ricky Barnes': 'USA',
  'Brandt Snedeker': 'USA', 'Stewart Cink': 'USA', 'Jonathan Byrd': 'USA',
  'Tim Herron': 'USA', 'John Rollins': 'USA', 'Carl Pettersson': 'SWE',
  'Charlie Beljan': 'USA', 'Eric Axley': 'USA', 'Chez Reavie': 'USA',
  'Arjun Atwal': 'IND', 'K.J. Choi': 'KOR', 'Y.E. Yang': 'KOR',
  'Graeme Storm': 'ENG', 'Barry Lane': 'ENG', 'Peter Hanson': 'SWE',
  'Robert Karlsson': 'SWE', 'Mikael Lundberg': 'SWE', 'Pelle Edberg': 'SWE',
  'Jbe Kruger': 'RSA', 'Jaco van Zyl': 'RSA', 'Tjaart van der Walt': 'RSA',
  'George Coetzee': 'RSA', 'Brandon Stone': 'RSA', 'Erik Van Rooyen': 'RSA',
  'Lanto Griffin': 'USA', 'Robby Shelton': 'USA', 'Greyson Sigg': 'USA',
  'Roger Sloan': 'CAN', 'Seamus Power': 'IRL', 'Shane Lowry': 'IRL',
  'Pádraig Harrington': 'IRL', 'Graeme McDowell': 'NIR',
  'Luke List': 'USA', 'Ryan Armour': 'USA', 'Roberto Castro': 'USA',
  'Kyle Stanley': 'USA', 'D.J. Trahan': 'USA', 'Tag Ridings': 'USA',
  'Kevin Tway': 'USA', 'Tom Hoge': 'USA', 'Sepp Straka': 'AUT',
  'Ryo Ishikawa': 'JPN', 'Shingo Katayama': 'JPN', 'Yusaku Miyazato': 'JPN',
  'Hiroshi Iwata': 'JPN', 'Prayad Marksaeng': 'THA', 'Thongchai Jaidee': 'THA',
  'Chapchai Nirat': 'THA', 'Thitiphun Chuayprakong': 'THA',
  'Bernd Ritthammer': 'GER', 'Florian Fritsch': 'GER', 'Marcel Siem': 'GER',
  'Max Schmitt': 'GER', 'Moritz Lampert': 'GER',
  'Nathan Kimsey': 'ENG', 'Jack Singh Brar': 'ENG', 'Todd Clements': 'ENG',
  'Sam Horsfield': 'ENG', 'Jordan Wrisdale': 'ENG', 'David Carey': 'IRL',
  'Gavin Moynihan': 'IRL', 'Dermot McElroy': 'NIR', 'Michael Hoey': 'NIR',
  'Tain Lee': 'SCO', 'David Law': 'SCO', 'Craig Howie': 'SCO',
  'James Morrison': 'ENG', 'Ashley Chesters': 'ENG', 'Laurie Canter': 'ENG',
  'Richard McEvoy': 'ENG', 'Oliver Farr': 'WAL', 'Cyril Bouniol': 'FRA',
  'Robin Roussel': 'FRA', 'Tom Vaillant': 'FRA', 'Julien Guerrier': 'FRA',
  'Hugo Bastian': 'FRA', 'Victor Riu': 'FRA',
  'Nacho Elvira': 'ESP', 'Alfredo Garcia-Heredia': 'ESP', 'Manuel Elvira': 'ESP',
  'Borja Virto': 'ESP', 'Eduardo De La Riva': 'ESP',
  'Santiago Tarrio': 'ESP', 'Pep Angles': 'ESP',
  'Darius Van Driel': 'NED', 'Lars Van Meijel': 'NED', 'Rowin Caron': 'NED',
  'Robin Williams': 'WAL', 'Rhys Enoch': 'WAL', 'Llewellyn Matthews': 'WAL',
  'Kim Koivu': 'FIN', 'Tapio Pulkkanen': 'FIN', 'Toomas Koivula': 'FIN',
  'Oliver Lindell': 'FIN', 'Sami Valimaki': 'FIN',
  'Niklas Lemke': 'SWE', 'Joel Sjoholm': 'SWE', 'Anton Karlsson': 'SWE',
  'Henrik Norlander': 'SWE', 'Rikard Karlberg': 'SWE',
  'Espen Kofstad': 'NOR', 'Mikael Lindberg': 'NOR',
  'Lucas Bjerregaard': 'DEN', 'Joachim B Hansen': 'DEN', 'Soren Kjeldsen': 'DEN',
  'Thomas Bjorn': 'DEN',
  'Matthieu Pavon': 'FRA', 'Gregoire Dupeyroux': 'FRA',
  'John Catlin': 'USA', 'Scott Hend': 'AUS', 'Wade Ormsby': 'AUS',
  'Andrew Dodt': 'AUS', 'Ashley Hall': 'AUS', 'Peter O\'Malley': 'AUS',
  'Richard Green': 'AUS', 'Steven Jeffress': 'AUS',
  'Marcus Fraser': 'AUS', 'Matthew Millar': 'AUS', 'Deyen Lawson': 'AUS',
  'Unho Park': 'AUS', 'Kurt Barnes': 'AUS', 'Jarrod Lyle': 'AUS',
  'Mikko Ilonen': 'FIN', 'Toni Hakula': 'FIN',
  'Berry Henson': 'USA', 'Michael Gellerman': 'USA', 'Chase Johnson': 'USA',
  'Cameron Percy': 'AUS', 'Alistair Presnell': 'AUS',
  'Pablo Martin Benavides': 'ESP', 'Gonzalo Fernandez-Castano': 'ESP',
  'Rafael Echenique': 'ARG', 'Maximo Munoz': 'ARG', 'Augusto Nunez': 'ARG',
  'Smylie Kaufman': 'USA', 'Grayson Murray': 'USA', 'Richy Werenski': 'USA',
  'Derek Fathauer': 'USA', 'Tom Lovelady': 'USA', 'Bronson La\'Cassie': 'AUS',
  'Matt Giles': 'AUS', 'Michael Wright': 'AUS',
  'Mikael Lindberg': 'SWE', 'Kristoffer Broberg': 'SWE',

  // Missing players from rankings
  'Jacob Bridgeman': 'USA', 'Sam Stevens': 'USA', 'Patrick Reed': 'USA',
  'Daniel Berger': 'USA', 'Max McGreevy': 'USA', 'Ricky Castillo': 'USA',
  'Rico Hoey': 'USA', 'Gary Woodland': 'USA', 'Max Greyserman': 'USA',
  'Caleb Surratt': 'USA', 'Isaiah Salinda': 'USA', 'Trevor Cone': 'USA',
  'Hayden Springer': 'USA', 'Noah Goodwin': 'USA', 'Mason Andersen': 'USA',
  'Cameron Champ': 'USA', 'Paul Peterson': 'USA', 'Sean Crocker': 'USA',
  'Andrew Wilson': 'USA', 'Anthony Kim': 'USA', 'Will Chandler': 'USA',
  'Harry Higgs': 'USA', 'Andy Ogletree': 'USA', 'Michael La Sasso': 'USA',
  'Jordan Gumberg': 'USA', 'Jason Kokrak': 'USA', 'Cameron Tringale': 'USA',
  'Matthew Wolff': 'USA', 'Quade Cummins': 'USA', 'Davis Bryant': 'USA',
  'Kevin Velo': 'USA', 'Peter Uihlein': 'USA', 'Ryggs Johnston': 'USA',
  'Braden Thornberry': 'USA', 'Gunner Wiebe': 'USA', 'Hudson Swafford': 'USA',
  'Erik Barnes': 'USA', 'Ben Kohles': 'USA', 'Dylan Wu': 'USA',
  'Patrick Fishburn': 'USA', 'Gordon Sargent': 'USA', 'Carson Young': 'USA',
  'Taylor Montgomery': 'USA', 'Martin Trainer': 'USA', 'Brian Campbell': 'USA',
  'Jayden Schaper': 'RSA', 'Casey Jarvis': 'RSA', 'Hennie Du Plessis': 'RSA',
  'Jacques Kruyswijk': 'RSA', 'Richard Sterne': 'RSA', 'Zander Lombard': 'RSA',
  'Thomas Aiken': 'RSA', 'Darren Fichardt': 'RSA', 'Ockie Strydom': 'RSA',
  'Daniel Hillier': 'NZL', 'Kazuma Kobori': 'NZL', 'Ben Campbell': 'NZL',
  'Alex Fitzpatrick': 'ENG', 'Dan Bradbury': 'ENG', 'Brandon Robinson Thompson': 'ENG',
  'Joe Dean': 'ENG', 'Richard Mansell': 'ENG', 'Matthew Baldwin': 'ENG',
  'Matthew Southgate': 'ENG', 'Ian Poulter': 'ENG', 'Sam Bairstow': 'ENG',
  'Tom McKibbin': 'NIR', 'Conor Purcell': 'IRL',
  'Elvis Smylie': 'AUS', 'Jason Scrivener': 'AUS', 'David Micheluzzi': 'AUS',
  'Matthew Riedel': 'AUS', 'Karl Vilips': 'AUS', 'Aaron Cockerill': 'CAN',
  'Taylor Dickson': 'CAN', 'Richard Lee': 'CAN', 'Adam Svensson': 'CAN',
  'Nico Echavarria': 'COL', 'Eugenio Chacarra': 'ESP', 'Angel Ayora': 'ESP',
  'David Puig': 'ESP', 'Jose Luis Ballester': 'ESP', 'Ignacio Elvira Mijares': 'ESP',
  'Alejandro Del Rey': 'ESP', 'Angel Hidalgo Portillo': 'ESP', 'Luis Masaveu': 'ESP',
  'Rasmus Neergaard-Petersen': 'DEN', 'Jacob Skov Olesen': 'DEN', 'Niklas Norgaard': 'DEN',
  'Jeff Winther': 'DEN', 'Jens Dantorp': 'SWE',
  'Ugo Coussaud': 'FRA', 'Frederic LaCroix': 'FRA', 'Martin Couvra': 'FRA',
  'David Ravetto': 'FRA', 'Alexander Levy': 'FRA', 'Julien Brun': 'FRA',
  'Freddy Schott': 'GER', 'Nicolai Von Dellingshausen': 'GER', 'Jannik De Bruyn': 'GER',
  'Max Rottluff': 'GER', 'Marcel Siem': 'GER', 'Matti Schmid': 'GER',
  'Younghan Song': 'KOR', 'Yubin Jang': 'KOR',
  'Yuto Katsuragawa': 'JPN', 'Jinichiro Kozuma': 'JPN', 'Kaito Onishi': 'JPN',
  'Alexander Bjork': 'SWE', 'Bjorn Hellgren': 'SWE', 'Tim Widing': 'SWE',
  'Marcus Kinhult': 'SWE', 'Vincent Norrman': 'SWE', 'Simon Forsstrom': 'SWE',
  'Bjorn Akesson': 'SWE', 'Andreas Halvorsen': 'NOR',
  'Johannes Veerman': 'NED', 'Joost Luiten': 'NED', 'Daan Huizing': 'NED',
  'Scott Jamieson': 'SCO', 'Richie Ramsay': 'SCO', 'Hamish Brown': 'SCO',
  'Lukas Nemecz': 'AUT', 'Matthias Schwab': 'AUT',
  'Veer Ahlawat': 'IND', 'Shubhankar Sharma': 'IND',
  'Francesco Laporta': 'ITA', 'Filippo Celli': 'ITA', 'Edoardo Molinari': 'ITA',
  'Adrian Meronk': 'POL', 'Miguel Tabuena': 'PHI',
  'Gavin Green': 'MAS', 'Fabrizio Zanotti': 'PAR',
  'Ricardo Gouveia': 'POR', 'Chieh-Po Lee': 'TPE', 'C.T. Pan': 'TPE',
  'Wenyi Ding': 'CHN', 'Matthieu Pavon': 'FRA', 'Matthis Besard': 'BEL',
  'Max Kieffer': 'GER', 'Gregorio De Leo': 'ARG', 'Jeremy Paul': 'USA',
  'Patrick Rodgers': 'USA', 'Austin Smotherman': 'USA', 'William Mouw': 'USA',
  'Steven Fisk': 'USA', 'David Ford': 'USA', 'Lee Hodges': 'USA',
  'Chad Ramey': 'USA', 'Mac Meissner': 'USA', 'Davis Thompson': 'USA',
  'Matt McCarty': 'USA', 'Johnny Keefer': 'USA', 'Kevin Roy': 'USA',
  'Ben Griffin': 'USA', 'Austin Eckroat': 'USA',
}

function PlayerName({ name, country }) {
  const flag = countryFlag(country)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {flag && <span style={{ fontSize: 14 }}>{flag}</span>}
      <span style={{ color: 'var(--heading)', fontWeight: 600 }}>{name}</span>
    </span>
  )
}

const WMO_DESC = (code) => {
  if (code === 0)  return 'Clear'
  if (code <= 3)   return 'Partly Cloudy'
  if (code <= 48)  return 'Foggy'
  if (code <= 67)  return 'Rain'
  if (code <= 77)  return 'Snow'
  if (code <= 82)  return 'Showers'
  if (code <= 99)  return 'Thunderstorm'
  return 'Unknown'
}

const NAV = [
  { id: 'optimizer',   label: 'DFS Optimizer',    icon: '⚡' },
  { id: 'value',       label: 'Value Finder',    icon: '◈' },
  { id: 'hot',         label: "Who's Hot?",        icon: '🔥' },
  { id: 'history',     label: 'Course History',   icon: '◷' },
  { id: 'lineup',      label: 'Lineup Builder',   icon: '◫' },
  { id: 'own',         label: 'Ownership',        icon: '◎' },
  { id: 'weather',     label: 'Tournament Weather', icon: '◌' },
  { id: 'cut',         label: 'Cut Probability',  icon: '◐' },
  { id: 'stats',       label: 'Field SG Stats',   icon: '◑' },
  { id: 'leaderboard', label: 'Leaderboard',      icon: '◆' },
  { id: 'rankings',    label: 'Model Rankings',   icon: '◇' },
  { id: 'simulations', label: 'Simulation Lab',   icon: '🎲' },
  { id: 'barpool', label: 'AI Pool Analyzer & Picks', icon: '🎰' },
]
const NAV_GROUPS = [
  { label: 'Live',      ids: ['leaderboard', 'rankings'] },
  { label: 'Data',     ids: ['hot', 'history', 'weather', 'cut', 'stats'] },
  { label: 'DFS Tools', ids: ['optimizer', 'simulations', 'value', 'lineup', 'own'] },
  { label: 'Pools', ids: ['barpool'] },
]

// ── Hooks & Utilities ──────────────────────────────────────────────

function useSort(data, defaultKey, defaultDir = 'desc') {
  const [sortKey, setSortKey] = useState(defaultKey)
  const [sortDir, setSortDir] = useState(defaultDir)
  const toggle = (key) => {
    if (key === sortKey) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }
  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey]
    if (typeof av === 'string') return sortDir === 'desc' ? av.localeCompare(bv) : bv.localeCompare(av)
    return sortDir === 'desc' ? bv - av : av - bv
  })
  return { sorted, sortKey, sortDir, toggle }
}

function col(label, key, sortKey, sortDir, toggle) {
  return { label, key, active: sortKey === key, dir: sortDir, onSort: key ? () => toggle(key) : undefined }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}
// ── Shared UI ──────────────────────────────────────────────────────

function StatCard({ label, value, sub, type }) {
  const isMobile = window.innerWidth < 768
  const accent = type === 'green' ? 'var(--green)' : type === 'gold' ? 'var(--gold)' : type === 'red' ? 'var(--red)' : 'var(--heading)'
  const bg     = type === 'green' ? 'var(--green-light)' : type === 'gold' ? 'var(--gold-light)' : type === 'red' ? 'var(--red-light)' : 'var(--surface)'
  const border = type === 'green' ? 'var(--green-mid)' : 'var(--border)'
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: isMobile ? '12px 14px' : '18px 22px', flex: 1, minWidth: isMobile ? 120 : 150 }}>
      <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: isMobile ? 4 : 8 }}>{label}</div>
      <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: accent, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function SortableTable({ columns, rows }) {
  const isMobile = window.innerWidth < 768
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 360 : 500 }}>
        <thead>
          <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
            {columns.map((c, i) => (
              <th key={i} onClick={c.onSort || undefined} style={{
                textAlign: 'left', padding: isMobile ? '8px 10px' : '11px 18px', fontSize: 10,
                letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
                color: c.active ? 'var(--green)' : 'var(--muted)',
                cursor: c.onSort ? 'pointer' : 'default',
                userSelect: 'none', whiteSpace: 'nowrap', transition: 'color 0.1s',
              }}>
                {c.label}
                {c.onSort && <span style={{ marginLeft: 5, fontSize: 9, opacity: c.active ? 1 : 0.3 }}>{c.active ? (c.dir === 'desc' ? '▼' : '▲') : '⬍'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: isMobile ? '10px 10px' : '13px 18px', fontSize: isMobile ? 12 : 14 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PageHeader({ title, sub }) {
  const isMobile = window.innerWidth < 768
  return (
    <div style={{ marginBottom: isMobile ? 16 : 24 }}>
      <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, color: 'var(--heading)', letterSpacing: -0.5 }}>{title}</div>
      <div style={{ fontSize: isMobile ? 11 : 13, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{sub}</div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {children}
    </div>
  )
}

function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--green-mid)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading live data...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <div style={{ background: 'var(--red-light)', border: '1px solid #fecaca', borderRadius: 12, padding: '20px 24px', color: 'var(--red)', fontSize: 14, fontWeight: 500 }}>
      ⚠️ {message || 'Something went wrong. Check your connection and try refreshing.'}
    </div>
  )
}

function ValueBadge({ val }) {
  const isHot = val >= 6.5, isGood = val >= 5.5
  return (
    <span style={{
      background: isHot ? 'var(--green-light)' : isGood ? '#f0fdf4' : 'var(--bg)',
      color: isHot ? 'var(--green-dark)' : isGood ? 'var(--green)' : 'var(--muted)',
      border: `1px solid ${isHot ? 'var(--green-mid)' : isGood ? '#bbf7d0' : 'var(--border)'}`,
      padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: 12,
      fontFamily: 'JetBrains Mono, monospace'
    }}>{val}</span>
  )
}

function ProjBadge({ val }) {
  const isHot = val >= 65, isGood = val >= 58
  return (
    <span style={{
      background: isHot ? 'var(--green-light)' : isGood ? '#f0fdf4' : 'var(--bg)',
      color: isHot ? 'var(--green-dark)' : isGood ? 'var(--green)' : 'var(--muted)',
      border: `1px solid ${isHot ? 'var(--green-mid)' : isGood ? '#bbf7d0' : 'var(--border)'}`,
      padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: 12,
      fontFamily: 'JetBrains Mono, monospace'
    }}>{val} pts</span>
  )
}

function PctBadge({ val }) {
  const pct = Math.round(val * 100)
  const isHot = pct >= 30, isGood = pct >= 15
  const color  = isHot ? 'var(--green-dark)' : isGood ? 'var(--green)' : 'var(--muted)'
  const bg     = isHot ? 'var(--green-light)' : isGood ? '#f0fdf4' : 'var(--bg)'
  const border = isHot ? 'var(--green-mid)' : isGood ? '#bbf7d0' : 'var(--border)'
  return (
    <span style={{ background: bg, color, border: `1px solid ${border}`, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
      {pct}%
    </span>
  )
}

function OwnBadge({ val }) {
  if (!val) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>TBD</span>
  const isLow = val <= 5, isMid = val <= 12
  const color = isLow ? 'var(--green-dark)' : isMid ? 'var(--gold)' : 'var(--red)'
  const bg    = isLow ? 'var(--green-light)' : isMid ? 'var(--gold-light)' : 'var(--red-light)'
  return (
    <span style={{ background: bg, color, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
      {val}% · {isLow ? 'Low' : isMid ? 'Mid' : 'High'}
    </span>
  )
}

// ── Data Fetching ──────────────────────────────────────────────────

async function fetchSchedule() {
  const res  = await dgFetch('get-schedule', { tour: 'pga', file_format: 'json' })
  const data = await res.json()
  const today = new Date().toISOString().slice(0, 10)

  const upcoming = data.schedule
    .filter(e => {
      const [y, m, d] = e.start_date.split('-').map(Number)
      const end = new Date(y, m - 1, d + 4) // end of Sunday
      return end > new Date(today)
    })
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 9)
    .map((e, i) => {
      const [y, m, d] = e.start_date.split('-').map(Number)
      const start     = new Date(y, m - 1, d)
      const end       = new Date(y, m - 1, d + 3)
      const dateStr   = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`
      return {
        event_id:   String(e.event_id),
        name:       e.event_name,
        course:     e.course,
        dates:      dateStr,
        start_date: e.start_date,
        end_date:   end.toISOString().slice(0, 10),
        latitude:   e.latitude,
        longitude:  e.longitude,
        status:     (() => {
  const [y, m, d] = e.start_date.split('-').map(Number)
  const start = new Date(y, m - 1, d)
  const end   = new Date(y, m - 1, d + 4) // end of Sunday
  const now   = new Date()
  if (now >= start && now < end) return 'live'
  if (now < start) return 'upcoming'
  return 'completed'
})(),
      }
    })
    .filter(e => e.status !== 'completed')
    .slice(0, 8)


  const completed = data.schedule
    .filter(e => e.status === 'completed' && e.winner !== 'TBD' && e.start_date?.startsWith('2026'))
    .sort((a, b) => b.start_date.localeCompare(a.start_date))
    .map(e => ({ event_id: String(e.event_id), name: e.event_name, start_date: e.start_date }))

  return { upcoming, completed }
}

async function fetchWeather(lat, lng, startDate, endDate) {
  const today        = new Date().toISOString().slice(0, 10)
  const clampedStart = startDate > today ? startDate : today
  const clampedEnd   = endDate   > today ? endDate   : today
  if (clampedStart > clampedEnd) return { daily: [], hourlyByDay: {} }

  const res  = await weatherFetch({
    latitude: lat, longitude: lng,
    daily: 'windspeed_10m_max,windgusts_10m_max,precipitation_probability_max,temperature_2m_max',
    hourly: 'temperature_2m,windspeed_10m,windgusts_10m,precipitation_probability,weathercode',
    wind_speed_unit: 'mph', temperature_unit: 'fahrenheit',
    timezone: 'auto', start_date: clampedStart, end_date: clampedEnd,
  })
  const data = await res.json()

  const rounds = ['Thu', 'Fri', 'Sat', 'Sun']
  const daily = (data.daily?.time || []).map((date, i) => {
    const dayOffset  = Math.round((new Date(date) - new Date(startDate)) / 86400000)
    const roundLabel = rounds[dayOffset] ? `Round ${dayOffset + 1} — ${rounds[dayOffset]}` : `Day ${dayOffset + 1}`

    // Calculate stats from hourly data between 6:00 and 19:00 only
    const dayHourly = (data.hourly?.time || [])
      .map((t, j) => {
        const [hDate, hTime] = t.split('T')
        const hour = parseInt(hTime.split(':')[0])
        if (hDate !== date || hour < 6 || hour > 19) return null
        return {
          wind:  Math.round(data.hourly.windspeed_10m[j]),
          gusts: Math.round(data.hourly.windgusts_10m[j]),
          rain:  data.hourly.precipitation_probability[j],
          temp:  Math.round(data.hourly.temperature_2m[j]),
        }
      })
      .filter(Boolean)

    const wind  = dayHourly.length > 0 ? Math.round(dayHourly.reduce((s, h) => s + h.wind, 0) / dayHourly.length)  : Math.round(data.daily.windspeed_10m_max[i])
    const gusts = dayHourly.length > 0 ? Math.round(dayHourly.reduce((s, h) => s + h.gusts, 0) / dayHourly.length) : Math.round(data.daily.windgusts_10m_max[i])
    const rain  = dayHourly.length > 0 ? Math.max(...dayHourly.map(h => h.rain))  : data.daily.precipitation_probability_max[i]
    const temp  = dayHourly.length > 0 ? Math.max(...dayHourly.map(h => h.temp))  : Math.round(data.daily.temperature_2m_max[i])

    const conditions = gusts > 25 || wind > 20 ? 'Windy' : gusts > 18 || wind > 12 ? 'Breezy' : rain > 40 ? 'Rainy' : 'Calm'
    const outlook    = gusts > 25 || wind > 20 ? 'Tough scoring' : gusts > 18 || wind > 12 ? 'Moderate difficulty' : rain > 40 ? 'Soft conditions' : 'Low scores expected'
    return { round: roundLabel, date, wind, gusts, rain, temp, conditions, outlook }
  })

  const hourlyByDay = {}
  ;(data.hourly?.time || []).forEach((t, i) => {
    const [date, time] = t.split('T')
    const hour = parseInt(time.split(':')[0])
    if (hour < 6 || hour > 19) return
    if (!hourlyByDay[date]) hourlyByDay[date] = []
    hourlyByDay[date].push({
      time: time.slice(0, 5), hour,
      temp:  Math.round(data.hourly.temperature_2m[i]),
      wind:  Math.round(data.hourly.windspeed_10m[i]),
      gusts: Math.round(data.hourly.windgusts_10m[i]),
      rain:  data.hourly.precipitation_probability[i],
      code:  data.hourly.weathercode[i],
      desc:  WMO_DESC(data.hourly.weathercode[i]),
    })
  })

  return { daily, hourlyByDay }
}

async function fetchLiveData() {
  const [dfsRes, predRes, sgRes, fieldRes] = await Promise.all([
    dgFetch('preds/fantasy-projection-defaults', { tour: 'pga', site: 'draftkings', slate: 'main', file_format: 'json' }),
    dgFetch('preds/pre-tournament', { tour: 'pga', file_format: 'json' }),
    dgFetch('preds/skill-ratings', { display: 'value', file_format: 'json' }),
    dgFetch('field-updates', { tour: 'pga', file_format: 'json' }),
  ])
  const [dfsData, predData, sgData, fieldData] = await Promise.all([dfsRes.json(), predRes.json(), sgRes.json(), fieldRes.json()])
  const countryMap = {}
  for (const p of (fieldData.field || [])) countryMap[p.dg_id] = p.country
  const predMap = {}, sgMap = {}
  for (const p of (predData.baseline || [])) predMap[p.dg_id] = p
  for (const p of (sgData.players   || [])) sgMap[p.dg_id]   = p
  const maxPts = Math.max(...dfsData.projections.map(p => p.proj_points_total))
  const minPts = Math.min(...dfsData.projections.map(p => p.proj_points_total))
  return dfsData.projections.map(p => {
    const pred       = predMap[p.dg_id] || {}, sg = sgMap[p.dg_id] || {}
    const projPoints = parseFloat(p.proj_points_total.toFixed(1))
    const value      = p.salary > 0 ? parseFloat((projPoints / (p.salary / 1000)).toFixed(2)) : 0
    const normalized = (projPoints - minPts) / (maxPts - minPts)
    return {
      name:      flipName(p.player_name),
      salary:    p.salary, projPoints, value,
      stdDev:    parseFloat(p.std_dev.toFixed(1)),
      cutProb:   pred.make_cut != null ? Math.round(pred.make_cut * 100) : Math.round(30 + normalized * 65),
      winProb:   pred.win    ?? 0,
      top10Prob: pred.top_10 ?? 0,
      top5Prob:  pred.top_5  ?? 0,
      sgTotal:   sg.sg_total != null ? parseFloat(sg.sg_total.toFixed(2)) : null,
      sgOtt:     sg.sg_ott   != null ? parseFloat(sg.sg_ott.toFixed(2))   : null,
      sgApp:     sg.sg_app   != null ? parseFloat(sg.sg_app.toFixed(2))   : null,
      sgArg:     sg.sg_arg   != null ? parseFloat(sg.sg_arg.toFixed(2))   : null,
      sgPutt:    sg.sg_putt  != null ? parseFloat(sg.sg_putt.toFixed(2))  : null,
      ownership: p.proj_ownership,
      dg_id:     p.dg_id,
      country:   countryMap[p.dg_id] || null,
    }
  })
}

async function fetchUpcomingField() {
  const res  = await dgFetch('field-updates', { tour: 'pga', file_format: 'json' })
  const data = await res.json()
  return data.field.map(p => ({
    name:      flipName(p.player_name),
    country:   p.country,
    dg_rank:   p.dg_rank   || 9999,
    owgr_rank: p.owgr_rank || 9999,
    dg_id:     p.dg_id,
  }))
}

// Fetches pre-tournament predictions + SG data for the upcoming field
// Used to power CutProbability and StatDeepDive before DFS salaries are released
async function fetchPreTournamentPlayers() {
  const [predRes, sgRes, fieldRes] = await Promise.all([
    dgFetch('preds/pre-tournament', { tour: 'pga', file_format: 'json' }),
    dgFetch('preds/skill-ratings', { display: 'value', file_format: 'json' }),
    dgFetch('field-updates', { tour: 'pga', file_format: 'json' }),
  ])
  const [predData, sgData, fieldData] = await Promise.all([predRes.json(), sgRes.json(), fieldRes.json()])
  const countryMap = {}
  for (const p of (fieldData.field || [])) countryMap[p.dg_id] = p.country
  const predMap = {}, sgMap = {}
  for (const p of (predData.baseline || [])) predMap[p.dg_id] = p
  for (const p of (sgData.players   || [])) sgMap[p.dg_id]   = p
  return (fieldData.field || []).map(p => {
    const pred = predMap[p.dg_id] || {}, sg = sgMap[p.dg_id] || {}
    return {
      name:      flipName(p.player_name),
      salary:    0,
      projPoints: 0,
      value:     0,
      stdDev:    0,
      cutProb:   pred.make_cut != null ? Math.round(pred.make_cut * 100) : 50,
      winProb:   pred.win    ?? 0,
      top10Prob: pred.top_10 ?? 0,
      top5Prob:  pred.top_5  ?? 0,
      sgTotal:   sg.sg_total != null ? parseFloat(sg.sg_total.toFixed(2)) : null,
      sgOtt:     sg.sg_ott   != null ? parseFloat(sg.sg_ott.toFixed(2))   : null,
      sgApp:     sg.sg_app   != null ? parseFloat(sg.sg_app.toFixed(2))   : null,
      sgArg:     sg.sg_arg   != null ? parseFloat(sg.sg_arg.toFixed(2))   : null,
      sgPutt:    sg.sg_putt  != null ? parseFloat(sg.sg_putt.toFixed(2))  : null,
      ownership: 0,
      dg_id:     p.dg_id,
      country:   countryMap[p.dg_id] || null,
    }
  })
}

function optimizeLineup(players, cap = 50000, picks = 6, locked = [], excluded = []) {
  const lockedPlayers = players.filter(p => locked.includes(p.name))
  const pool = players
    .filter(p => !excluded.includes(p.name) && !locked.includes(p.name))
    .sort((a, b) => b.projPoints - a.projPoints)
  const lockedSalary = lockedPlayers.reduce((s, p) => s + p.salary, 0)
  const neededPicks  = picks - lockedPlayers.length
  const remainingCap = cap - lockedSalary
  if (neededPicks === 0) return lockedPlayers
  if (remainingCap < 0 || neededPicks < 0) return null
  let bestPts = -1, bestLineup = []
  const deadline = Date.now() + 3000
  let greedyCap = remainingCap
  const greedy  = []
  for (const p of [...pool].sort((a, b) => b.value - a.value)) {
    if (greedy.length >= neededPicks) break
    if (p.salary <= greedyCap) { greedy.push(p); greedyCap -= p.salary }
  }
  if (greedy.length === neededPicks) { bestPts = greedy.reduce((s, p) => s + p.projPoints, 0); bestLineup = greedy }
  function dfs(idx, picksLeft, capLeft, current, pts) {
    if (Date.now() > deadline) return
    if (picksLeft === 0) { if (pts > bestPts) { bestPts = pts; bestLineup = [...current] }; return }
    if (idx > pool.length - picksLeft) return
    const ub = pts + pool.slice(idx, idx + picksLeft).reduce((s, p) => s + p.projPoints, 0)
    if (ub <= bestPts) return
    for (let i = idx; i <= pool.length - picksLeft; i++) {
      const p = pool[i]
      if (p.salary <= capLeft) { current.push(p); dfs(i + 1, picksLeft - 1, capLeft - p.salary, current, pts + p.projPoints); current.pop() }
    }
  }
  dfs(0, neededPicks, remainingCap, [], 0)
  return [...lockedPlayers, ...bestLineup]
}

// ── Pages ──────────────────────────────────────────────────────────

function FieldPreview({ tournament, field }) {
  const { sorted, sortKey, sortDir, toggle } = useSort(field, 'dg_rank')
  const cols = [
    col('Player',  'name',      sortKey, sortDir, toggle),
    col('Country', 'country',   sortKey, sortDir, toggle),
    col('DG Rank', 'dg_rank',   sortKey, sortDir, toggle),
    col('OWGR',    'owgr_rank', sortKey, sortDir, toggle),
  ]
  return (
    <div>
      <div style={{ background: 'var(--gold-light)', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 14 }}>
        <div style={{ fontSize: 22 }}>📅</div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 14, marginBottom: 4 }}>Projections not yet available</div>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>DraftKings salaries and projections for <strong>{tournament.name}</strong> release the Monday before the event.</div>
        </div>
      </div>
      <PageHeader title={`${tournament.name} — Field`} sub={`${tournament.course} · ${tournament.dates} · ${field.length} players`} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Field Size" value={field.length} sub="Players confirmed" type="green" />
        <StatCard label="Course" value={tournament.course.split('(')[0].trim()} sub={tournament.dates} />
        <StatCard label="Projections" value="Monday" sub="Before tournament week" type="gold" />
      </div>
      <Card>
        <SortableTable columns={cols} rows={sorted.map(p => [
          <PlayerName name={p.name} country={p.country} />,
          <span style={{ fontSize: 12, background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 6, color: 'var(--muted)' }}>{p.country}</span>,
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: p.dg_rank <= 20 ? 'var(--green)' : 'var(--text)', fontWeight: p.dg_rank <= 20 ? 700 : 400 }}>{p.dg_rank === 9999 ? '—' : p.dg_rank}</span>,
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--muted)' }}>{p.owgr_rank === 9999 ? '—' : p.owgr_rank}</span>,
        ])} />
      </Card>
    </div>
  )
}

function ValueFinder({ players }) {
  const { sorted, sortKey, sortDir, toggle } = useSort(players, 'value')
  const cols = [
    col('Player',         'name',       sortKey, sortDir, toggle),
    col('Salary',         'salary',     sortKey, sortDir, toggle),
    col('Proj Points',    'projPoints', sortKey, sortDir, toggle),
    col('Value (pts/$k)', 'value',      sortKey, sortDir, toggle),
    col('Std Dev',        'stdDev',     sortKey, sortDir, toggle),
  ]
  const top = [...players].sort((a, b) => b.value - a.value)[0]
  return (
    <div>
      <PageHeader title="Value Finder" sub="Live DraftKings data · Click any column to sort" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Top Value Pick" value={top?.name.split(' ')[1] || '—'} sub={`${top?.value} pts per $1k`} type="green" />
        <StatCard label="Avg Proj Points" value={(players.reduce((s, p) => s + p.projPoints, 0) / players.length).toFixed(1)} sub="Field average" />
        <StatCard label="Field Size" value={players.length} sub="Players in slate" type="gold" />
      </div>
      <Card>
        <SortableTable columns={cols} rows={sorted.map(p => [
          <PlayerName name={p.name} country={p.country} />,
          <span style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>${p.salary.toLocaleString()}</span>,
          <ProjBadge val={p.projPoints} />,
          <ValueBadge val={p.value} />,
          <span style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{p.stdDev}</span>,
        ])} />
      </Card>
    </div>
  )
}

function WhosHot({ players, completedEvents }) {
  const [form, setForm]         = useState({})
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!players.length || !completedEvents.length) { setLoading(false); return }
    async function fetchForm() {
      try {
        const results = []
        for (const e of completedEvents) {
          const result = await dgFetch('preds/pre-tournament-archive', {
            tour: 'pga', event_id: e.event_id,
            year: new Date(e.start_date).getFullYear(), file_format: 'json'
          })
            .then(r => r.text())
            .then(text => {
              const clean = text.replace(/:\s*NaN/g, ': null')
              const data  = JSON.parse(clean)
              return { event: e, players: data.baseline || [] }
            })
            .catch(() => ({ event: e, players: [] }))
          results.push(result)
          await new Promise(res => setTimeout(res, 150))
        }
        const map = {}
        for (const { event, players: ep } of results) {
          if (ep.length === 0) continue
          for (const p of ep) {
            if (p.fin_text && p.fin_text !== '') {
              if (!map[p.dg_id]) map[p.dg_id] = []
              map[p.dg_id].push({ event: event.name, date: event.start_date, fin: p.fin_text })
            }
          }
        }
        setForm(map)
        // Cache for Simulation Lab composite model
        window.__simFormCache = map
      } catch (e) {
        console.error(e)
        setError('Failed to load form data. Try refreshing.')
      } finally {
        setLoading(false)
      }
    }
    fetchForm()
  }, [players.length, completedEvents.length])

  const finPoints = (fin) => {
    if (!fin || fin === 'WD' || fin === 'DQ' || fin === 'MDF') return 0
    if (fin === 'CUT') return 0.5
    const num = parseInt(fin.replace('T', ''))
    if (num === 1) return 12; if (num <= 3) return 9; if (num <= 5) return 7
    if (num <= 10) return 5; if (num <= 20) return 3; if (num <= 30) return 2
    if (num <= 50) return 1.5; return 1
  }

  const calcHeat = (results) => {
    const played = results.filter(r => r.fin && r.fin !== '' && r.date?.startsWith('2026'))
    if (played.length === 0) return { score: 0, played: [] }
    const recentFive = played.slice(0, 5)
    const hasRecentWin = recentFive.some(r => r.fin === '1')
    let weightedScore = 0, totalWeight = 0
    played.forEach((r, i) => {
      let weight = i < 3 ? 3 : i < 6 ? 2 : 1
      if (hasRecentWin && r.fin === '1' && i < 5) weight = 5
      weightedScore += finPoints(r.fin) * weight
      totalWeight   += weight
    })
    const avg = totalWeight > 0 ? weightedScore / totalWeight : 0
    return { score: parseFloat(avg.toFixed(2)), played }
  }

  const getTemp = (score) => {
    if (score >= 4)   return { label: 'Blazing Hot 🔥🔥🔥',   color: '#b45309',           bg: '#fef3c7',            border: '#fde68a' }
    if (score >= 2.5) return { label: 'Hot 🔥',           color: 'var(--green-dark)', bg: 'var(--green-light)', border: 'var(--green-mid)' }
    if (score >= 1.2) return { label: 'Average',       color: 'var(--muted)',      bg: 'var(--bg)',          border: 'var(--border)' }
    if (score >= 0.5) return { label: 'Cold ❄️',          color: '#1d4ed8',           bg: '#eff6ff',            border: '#bfdbfe' }
    return                 { label: 'Ice Cold 🧊',        color: '#7c3aed',           bg: '#f5f3ff',            border: '#ddd6fe' }
  }

  const finBadge = (fin, isRecent) => {
    if (!fin) return <span style={{ color: 'var(--border)', fontSize: 11 }}>—</span>
    if (fin === 'CUT' || fin === 'WD' || fin === 'DQ') return (
      <span style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '2px 7px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: isRecent ? '2px solid var(--red)' : 'none' }}>{fin}</span>
    )
    const num   = parseInt(fin.replace('T', ''))
    const color = num === 1 ? '#b45309' : num <= 5 ? 'var(--green-dark)' : num <= 10 ? 'var(--green)' : num <= 25 ? 'var(--gold)' : 'var(--muted)'
    const bg    = num === 1 ? '#fef3c7' : num <= 5 ? 'var(--green-light)' : num <= 10 ? '#f0fdf4' : num <= 25 ? 'var(--gold-light)' : 'var(--bg)'
    return (
      <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', border: isRecent ? `2px solid ${color}` : '1px solid transparent' }}>
        {fin}
      </span>
    )
  }

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  const playerForm = players.map(p => {
    const results           = form[p.dg_id] || []
    const { score, played } = calcHeat(results)
    const temp              = getTemp(score)
const finalTemp = played.length === 0 ? { label: 'No Data', color: 'var(--muted)', bg: 'var(--bg)', border: 'var(--border)' } : temp
    return { ...p, heatScore: score, playedEvents: played, temp: finalTemp, eventsPlayed: played.length }
  }).sort((a, b) => b.heatScore - a.heatScore)

  const extremelyHot = playerForm.filter(p => p.heatScore >= 4).length
  const hot          = playerForm.filter(p => p.heatScore >= 2.5 && p.heatScore < 4).length
  const cold         = playerForm.filter(p => p.heatScore < 1.2 && p.eventsPlayed > 0).length

  return (
    <div>
      <PageHeader title="Who's Hot?" sub="Weighted by most recent starts · 2026 season only" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Blazing Hot 🔥🔥🔥" value={extremelyHot} sub="Weighted score 4+"    type="gold" />
        <StatCard label="Hot 🔥"           value={hot}          sub="Weighted score 2.5–4"  type="green" />
        <StatCard label="Cold ❄️" value={cold}       sub="Struggling in 2026"    type="red" />
      </div>
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
              {['#', 'Player', 'Temperature', 'Events', '2026 Finishes'].map(h => (
                <th key={h} style={{ padding: '11px 18px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playerForm.map((p, i) => {
              const isOpen = expanded === p.name
              return (
                <React.Fragment key={`hot-${i}`}>
                  <tr
                    style={{ borderBottom: isOpen ? 'none' : '1px solid var(--border)', background: isOpen ? '#fffbeb' : 'transparent', transition: 'background 0.1s' }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#f0fdf4' }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}>
                    <td style={{ padding: '12px 18px', fontSize: 13, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{i + 1}</td>
                    <td style={{ padding: '12px 18px', fontSize: 14 }}><PlayerName name={p.name} country={p.country} /></td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ background: p.temp.bg, color: p.temp.color, border: `1px solid ${p.temp.border}`, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {p.temp.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: 13, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{p.eventsPlayed}</td>
                    <td style={{ padding: '12px 18px' }}>
                      {p.eventsPlayed > 0 ? (
                        <button onClick={() => setExpanded(isOpen ? null : p.name)} style={{
                          background: isOpen ? 'var(--green-light)' : 'var(--bg)',
                          color:      isOpen ? 'var(--green-dark)' : 'var(--muted)',
                          border:     `1px solid ${isOpen ? 'var(--green-mid)' : 'var(--border)'}`,
                          padding: '4px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600
                        }}>{isOpen ? 'Hide' : 'Show'}</button>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: 12 }}>No data</span>
                      )}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={5} style={{ padding: 0, borderBottom: '2px solid var(--green-mid)' }}>
                        <div style={{ background: '#fffbeb', padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                            <div style={{ fontSize: 11, color: p.temp.color, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                              2026 Season — {p.playedEvents.length} Starts
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>· Highlighted = last 3 starts (3× weight)</div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {p.playedEvents.map((r, j) => (
                              <div key={j} style={{
                                background: j < 3 ? 'white' : 'var(--bg)',
                                border: j < 3 ? `2px solid ${p.temp.border}` : '1px solid var(--border)',
                                borderRadius: 10, padding: '10px 14px', minWidth: 140, position: 'relative'
                              }}>
                                {j < 3 && <div style={{ position: 'absolute', top: -8, left: 10, background: p.temp.bg, border: `1px solid ${p.temp.border}`, borderRadius: 10, padding: '1px 6px', fontSize: 9, color: p.temp.color, fontWeight: 700 }}>3× WEIGHT</div>}
                                {j >= 3 && j < 6 && <div style={{ position: 'absolute', top: -8, left: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '1px 6px', fontSize: 9, color: 'var(--muted)', fontWeight: 700 }}>2× WEIGHT</div>}
                                <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, marginTop: 4, fontWeight: 500 }}>{r.event.split(' ').slice(0, 4).join(' ')}</div>
                                <div>{finBadge(r.fin, j < 3)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function CourseHistory({ players, tournament }) {
  const [history, setHistory] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019]

  useEffect(() => {
    if (!players || players.length === 0) { setLoading(false); return }
    setLoading(true); setError(null)
    async function fetchHistory() {
      try {
        const results = await Promise.all(
          years.map(year =>
            dgFetch('preds/pre-tournament-archive', { tour: 'pga', event_id: tournament.event_id, year, file_format: 'json' })
              .then(r => r.text())
              .then(text => {
                const clean = text.replace(/:\s*NaN/g, ': null')
                const data  = JSON.parse(clean)
                return { year, players: data.baseline || [] }
              })
              .catch(() => ({ year, players: [] }))
          )
        )
        const map = {}
        for (const { year, players: yp } of results) {
          for (const p of yp) {
            if (!map[p.dg_id]) map[p.dg_id] = {}
            map[p.dg_id][year] = p.fin_text
          }
        }
        setHistory(map)
      } catch (e) { console.error(e); setError('Failed to load course history.') }
      finally { setLoading(false) }
    }
    fetchHistory()
  }, [players.length, tournament.event_id])

  const finColor = (fin) => {
    if (!fin) return 'var(--muted)'
    if (fin === 'CUT' || fin === 'WD' || fin === 'DQ') return 'var(--red)'
    const num = parseInt(fin.replace('T', ''))
    if (num === 1) return 'var(--green-dark)'; if (num <= 10) return 'var(--green)'; if (num <= 25) return 'var(--gold)'; return 'var(--muted)'
  }
  const finBg = (fin) => {
    if (!fin) return 'transparent'
    if (fin === 'CUT' || fin === 'WD' || fin === 'DQ') return 'var(--red-light)'
    const num = parseInt(fin.replace('T', ''))
    if (num === 1) return 'var(--green-light)'; if (num <= 10) return 'var(--green-light)'; if (num <= 25) return 'var(--gold-light)'; return 'var(--bg)'
  }
  const bestFinish = (dg_id) => {
    const fins = years.map(y => history[dg_id]?.[y]).filter(Boolean).filter(f => f !== 'CUT' && f !== 'WD' && f !== 'DQ')
    if (fins.length === 0) return 999
    return Math.min(...fins.map(f => parseInt(f.replace('T', ''))))
  }
  const sortedPlayers = [...players].sort((a, b) => bestFinish(a.dg_id) - bestFinish(b.dg_id))
  const bestPlayer    = sortedPlayers.find(p => bestFinish(p.dg_id) < 999)
  const firstTimers   = players.filter(p => years.every(y => !history[p.dg_id]?.[y])).length

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  return (
    <div>
      <PageHeader title="Course History" sub={`${tournament.name} · Last 7 years · Sorted by best finish`} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Best Historical" value={bestPlayer?.name.split(' ')[1] || '—'} sub={bestPlayer ? `Best: ${bestFinish(bestPlayer.dg_id) === 1 ? '1st' : `T${bestFinish(bestPlayer.dg_id)}`}` : 'No data'} type="green" />
        <StatCard label="First Timers" value={firstTimers} sub="No history at this course" />
        <StatCard label="Data Source" value="Live" sub="DataGolf archive" type="gold" />
      </div>
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '11px 18px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Player</th>
              {years.map(y => <th key={y} style={{ textAlign: 'center', padding: '11px 14px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>{y}</th>)}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '10px 8px', fontSize: 12, maxWidth: 90, wordBreak: 'break-word' }}><PlayerName name={p.name} country={p.country} /></td>
                {years.map(y => {
                  const fin = history[p.dg_id]?.[y]
                  return (
                    <td key={y} style={{ padding: '8px 4px', textAlign: 'center' }}>
                      {fin ? (
                        fin === '1' ? (
                          <span style={{ background: 'var(--green-light)', color: 'var(--green-dark)', padding: '2px 6px', borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', border: '1px solid var(--green-mid)', whiteSpace: 'nowrap', display: 'inline-block' }}>🏆1</span>
                        ) : (
                          <span style={{ background: finBg(fin), color: finColor(fin), padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{fin}</span>
                        )
                      )
                           : <span style={{ color: 'var(--border)', fontSize: 12 }}>—</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function Ownership({ players }) {
  const avgOwn = players.filter(p => p.ownership > 0).reduce((s, p) => s + p.ownership, 0) / players.filter(p => p.ownership > 0).length || 1
  const avgPts = players.reduce((s, p) => s + p.projPoints, 0) / players.length || 1
  const withLeverage = players.map(p => ({
    ...p,
    leverage: p.ownership > 0 ? parseFloat(((p.projPoints / avgPts) / (p.ownership / avgOwn)).toFixed(2)) : null
  }))
  const { sorted, sortKey, sortDir, toggle } = useSort(withLeverage, 'leverage')
  const cols = [
    col('Player',      'name',       sortKey, sortDir, toggle),
    col('Salary',      'salary',     sortKey, sortDir, toggle),
    col('Proj Own%',   'ownership',  sortKey, sortDir, toggle),
    col('Proj Points', 'projPoints', sortKey, sortDir, toggle),
    col('Leverage',    'leverage',   sortKey, sortDir, toggle),
  ]
  const topLeverage = [...withLeverage].filter(p => p.leverage != null).sort((a, b) => b.leverage - a.leverage)[0]
  const leverageBadge = (val) => {
    if (val == null) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>TBD</span>
    const isGreat = val >= 1.3, isGood = val >= 1.0, isPoor = val < 0.8
    const color = isGreat ? 'var(--green-dark)' : isGood ? 'var(--green)' : isPoor ? 'var(--red)' : 'var(--gold)'
    const bg    = isGreat ? 'var(--green-light)' : isGood ? '#f0fdf4' : isPoor ? 'var(--red-light)' : 'var(--gold-light)'
    const label = isGreat ? '🔥 High' : isGood ? '✓ Good' : isPoor ? '↓ Chalk' : '→ Neutral'
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color, minWidth: 36 }}>{val}×</span>
        <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{label}</span>
      </div>
    )
  }
  return (
    <div>
      <PageHeader title="Ownership & Leverage" sub="Leverage = projected value relative to expected ownership · Higher is better" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>What is Leverage?</div>
          <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>
            A score above <strong>1.0×</strong> means a player is projected better than their ownership suggests — undervalued by the field.
            A score below <strong>1.0×</strong> means chalk — high ownership relative to projection.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Best Leverage Play" value={topLeverage?.name.split(' ')[1] || '—'} sub={topLeverage ? `${topLeverage.leverage}× leverage score` : 'Own% pending'} type="green" />
        <StatCard label="High Leverage (1.3×+)" value={withLeverage.filter(p => p.leverage >= 1.3).length} sub="Projected above their ownership" type="green" />
        <StatCard label="Chalk Plays (<0.8×)" value={withLeverage.filter(p => p.leverage != null && p.leverage < 0.8).length} sub="High ownership vs projection" type="red" />
        <StatCard label="Own% Status" value={players.some(p => p.ownership > 0) ? 'Live' : 'TBD'} sub={players.some(p => p.ownership > 0) ? 'Data available' : 'Releases Thu morning'} type="gold" />
      </div>
      <Card>
        <SortableTable columns={cols} rows={sorted.map(p => [
          <PlayerName name={p.name} country={p.country} />,
          <span style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>${p.salary.toLocaleString()}</span>,
          <OwnBadge val={p.ownership} />,
          <ProjBadge val={p.projPoints} />,
          leverageBadge(p.leverage),
        ])} />
      </Card>
    </div>
  )
}

function LineupBuilder({ players }) {
  const [lineup, setLineup] = useState([])
  const { sorted, sortKey, sortDir, toggle } = useSort(players, 'value')
  const CAP = 50000
  const used = lineup.reduce((s, p) => s + p.salary, 0)
  const remaining = CAP - used
  const togglePlayer = (p) => {
    if (lineup.find(l => l.name === p.name)) setLineup(lineup.filter(l => l.name !== p.name))
    else if (lineup.length < 6) setLineup([...lineup, p])
  }
  const cols = [
    col('Player',      'name',       sortKey, sortDir, toggle),
    col('Salary',      'salary',     sortKey, sortDir, toggle),
    col('Proj Points', 'projPoints', sortKey, sortDir, toggle),
    col('Value',       'value',      sortKey, sortDir, toggle),
    { label: 'Action' },
  ]
  return (
    <div>
      <PageHeader title="Lineup Builder" sub="Select 6 players — stay under the $50,000 DraftKings salary cap" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Players Selected" value={`${lineup.length} / 6`} type={lineup.length === 6 ? 'green' : undefined} />
        <StatCard label="Salary Used" value={`$${used.toLocaleString()}`} sub={`of $${CAP.toLocaleString()}`} type={used > CAP ? 'red' : 'gold'} />
        <StatCard label="Remaining" value={`$${remaining.toLocaleString()}`} type={remaining < 0 ? 'red' : 'green'} />
        {lineup.length > 0 && <StatCard label="Avg Proj Pts" value={(lineup.reduce((s, p) => s + p.projPoints, 0) / lineup.length).toFixed(1)} sub="Lineup avg" type="green" />}
      </div>
      {lineup.length > 0 && (
        <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: 'var(--green)', marginBottom: 10, textTransform: 'uppercase', fontWeight: 700 }}>Current Lineup</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {lineup.map(p => (
              <span key={p.name} style={{ background: 'white', border: '1px solid var(--green-mid)', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: 'var(--heading)', fontWeight: 500 }}>
                <PlayerName name={p.name} country={p.country} /> <span style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>${p.salary.toLocaleString()}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <Card>
        <SortableTable columns={cols} rows={sorted.map(p => {
          const inLineup = lineup.find(l => l.name === p.name)
          const disabled = !inLineup && lineup.length === 6
          return [
            <PlayerName name={p.name} country={p.country} />,
            <span style={{ color: disabled ? 'var(--muted)' : 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>${p.salary.toLocaleString()}</span>,
            <ProjBadge val={p.projPoints} />,
            <ValueBadge val={p.value} />,
            <button onClick={() => togglePlayer(p)} disabled={disabled} style={{
              background: inLineup ? 'var(--red-light)' : disabled ? 'var(--bg)' : 'var(--green-light)',
              color: inLineup ? 'var(--red)' : disabled ? 'var(--muted)' : 'var(--green-dark)',
              border: `1px solid ${inLineup ? '#fecaca' : disabled ? 'var(--border)' : 'var(--green-mid)'}`,
              padding: '5px 16px', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'all 0.15s'
            }}>{inLineup ? 'Remove' : 'Add'}</button>
          ]
        })} />
      </Card>
    </div>
  )
}
function SimPctBadge({ val, thresholds = [10, 5] }) {
  const v = parseFloat(val)
  const color = v >= thresholds[0] ? 'var(--green)' : v >= thresholds[1] ? 'var(--gold)' : 'var(--muted)'
  const bg    = v >= thresholds[0] ? 'var(--green-light)' : v >= thresholds[1] ? 'var(--gold-light)' : 'var(--bg)'
  const border = v >= thresholds[0] ? 'var(--green-mid)' : v >= thresholds[1] ? '#fde68a' : 'var(--border)'
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', background: bg, color, border: `1px solid ${border}` }}>
      {v > 0 ? `${val}%` : '—'}
    </span>
  )
}
function Simulations({ players, completedEvents = [], activeTournament = null }) {
  const [simCount,      setSimCount]      = useState(2000)
  const [simRunning,    setSimRunning]    = useState(false)
  const [playerSims,    setPlayerSims]    = useState([])
  const [lineupText,    setLineupText]    = useState('')
  const [lineupResults, setLineupResults] = useState(null)
  const [activeView,    setActiveView]    = useState('player')
  const [lastRun,       setLastRun]       = useState(null)
  const [progress,      setProgress]      = useState(0)

  const randNormal = () => {
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  }

  const runPlayerSims = () => {
    setSimRunning(true)
    setProgress(0)
    const batchSize = Math.ceil(simCount / 10)
    const counts = {}
    players.forEach(p => { counts[p.name] = { win: 0, top5: 0, top10: 0, top20: 0, madeCut: 0, totalPts: 0 } })
    let done = 0

    // ── Composite skill model ─────────────────────────────────────────────────
    // Factor 1: SG Total (40%) — raw skill baseline
    // Factor 2: DataGolf winProb (25%) — bakes in course fit, form, everything
    // Factor 3: Recent form (20%) — hot players get a boost
    // Factor 4: Course history (15%) — past Augusta/course finishes
    // ─────────────────────────────────────────────────────────────────────────

    const maxProj = Math.max(...players.map(p => p.projPoints || 0)) || 80

    // Factor 1: normalize SG Total to a 0-1 scale
    const sgVals = players.map(p => p.sgTotal).filter(v => v != null)
    const sgMin = sgVals.length ? Math.min(...sgVals) : -2
    const sgMax = sgVals.length ? Math.max(...sgVals) : 3
    const sgScore = (p) => {
      if (p.sgTotal != null) return (p.sgTotal - sgMin) / (sgMax - sgMin)
      return p.projPoints > 0 ? (p.projPoints - maxProj * 0.6) / (maxProj * 0.4) : 0.2
    }

    // Factor 2: DataGolf winProb (already 0-1)
    const maxWinProb = Math.max(...players.map(p => p.winProb || 0)) || 0.15
    const winProbScore = (p) => Math.min((p.winProb || 0) / maxWinProb, 1)

    // Factor 3: Recent form — weight recent finishes (last 6 events, recency weighted)
    const formMap = {}
    players.forEach(p => { formMap[p.dg_id] = 0.3 }) // default neutral
    if (completedEvents.length > 0 && window.__simFormCache) {
      const cache = window.__simFormCache
      const finPts = (fin) => {
        if (!fin || fin === 'CUT' || fin === 'WD') return 0
        const n = parseInt((fin || '').replace('T',''))
        if (n === 1) return 1.0; if (n <= 3) return 0.85; if (n <= 5) return 0.75
        if (n <= 10) return 0.6; if (n <= 20) return 0.45; if (n <= 40) return 0.3
        return 0.2
      }
      players.forEach(p => {
        const results = cache[p.dg_id] || []
        if (results.length === 0) { formMap[p.dg_id] = 0.3; return }
        let score = 0, weight = 0
        results.slice(0, 6).forEach((r, i) => {
          const w = i === 0 ? 3 : i < 3 ? 2 : 1
          score += finPts(r.fin) * w
          weight += w
        })
        formMap[p.dg_id] = weight > 0 ? score / weight : 0.3
      })
    }

    // Factor 4: Course history score (Augusta or current course)
    // We use top10Prob as a proxy since it correlates with course fit
    const maxTop10 = Math.max(...players.map(p => p.top10Prob || 0)) || 0.3
    const courseScore = (p) => Math.min((p.top10Prob || 0) / maxTop10, 1)

    // Composite skill: weighted blend → convert back to SG-like scale
    const compositeSkill = (p) => {
const sg   = sgScore(p)       * 0.20
      const wp   = winProbScore(p)  * 0.20
      const form = (formMap[p.dg_id] || 0.3) * 0.35
      const hist = courseScore(p)   * 0.25
      const composite = sg + wp + form + hist  // 0 to 1
      // Compress skill gap using square root — reduces elite player dominance
      const raw = (composite - 0.5) * 4
      return raw > 0 ? Math.sqrt(raw) * 1.2 : raw * 0.8
    }

    const runBatch = () => {
      const end = Math.min(done + batchSize, simCount)
      for (let i = done; i < end; i++) {
        const simScores = players.map(p => ({
          name: p.name,
          score: compositeSkill(p) + randNormal() * 1.5
        })).sort((a, b) => b.score - a.score)
        const cutLine = Math.floor(simScores.length * 0.65)
        simScores.forEach((p, idx) => {
          if (!counts[p.name]) return
          counts[p.name].totalPts += p.score
          if (idx < cutLine) counts[p.name].madeCut++
          if (idx === 0)  counts[p.name].win++
          if (idx < 5)    counts[p.name].top5++
          if (idx < 10)   counts[p.name].top10++
          if (idx < 20)   counts[p.name].top20++
        })
      }
      done = end
      setProgress(Math.round((done / simCount) * 100))
      if (done < simCount) {
        setTimeout(runBatch, 0)
      } else {
        const results = players.map(p => ({
          ...p,
         winPct:   parseFloat(((counts[p.name].win     / simCount) * 100).toFixed(1)),
        top5Pct:  parseFloat(((counts[p.name].top5    / simCount) * 100).toFixed(1)),
        top10Pct: parseFloat(((counts[p.name].top10   / simCount) * 100).toFixed(1)),
        top20Pct: parseFloat(((counts[p.name].top20   / simCount) * 100).toFixed(1)),
        cutPct:   parseFloat(((counts[p.name].madeCut / simCount) * 100).toFixed(1)),
        avgPts:   parseFloat((counts[p.name].totalPts / simCount).toFixed(1)),
        })).sort((a, b) => parseFloat(b.winPct) - parseFloat(a.winPct))
        setPlayerSims(results)
        window.__simResults = results
        setLastRun(new Date())
        setSimRunning(false)
        setProgress(100)
      }
    }
    setTimeout(runBatch, 50)
  }

  const evaluateLineups = () => {
    const lines   = lineupText.trim().split('\n').filter(l => l.trim())
    const lineups = lines.map(line => line.split(',').map(n => n.trim()))
    if (!lineups.length || playerSims.length === 0) return
    setSimRunning(true)
    setTimeout(() => {
      const lineupCounts = lineups.map(() => ({ cash: 0, top3: 0, totalScore: 0 }))
      for (let i = 0; i < simCount; i++) {
        const scoreMap = {}
        players.forEach(p => { scoreMap[p.name] = p.projPoints + randNormal() * (p.stdDev > 0 ? p.stdDev : 12) })
        const lineupScores = lineups.map(lineup => lineup.reduce((sum, name) => sum + (scoreMap[name] || 0), 0))
        const sorted = [...lineupScores].sort((a, b) => b - a)
        const cashLine = sorted[Math.floor(sorted.length * 0.5)] ?? 0
        const maxScore = Math.max(...lineupScores)
        lineupScores.forEach((score, idx) => {
          lineupCounts[idx].totalScore += score
          if (score >= cashLine) lineupCounts[idx].cash++
          if (score === maxScore) lineupCounts[idx].top3++
        })
      }
      setLineupResults(lineups.map((lineup, i) => ({
        lineup,
        cashRate: ((lineupCounts[i].cash      / simCount) * 100).toFixed(1),
        winRate:  ((lineupCounts[i].top3      / simCount) * 100).toFixed(1),
        avgScore: (lineupCounts[i].totalScore / simCount).toFixed(1),
        salary:   lineup.reduce((s, name) => s + (players.find(p => p.name === name)?.salary || 0), 0),
      })))
      setSimRunning(false)
    }, 50)
  }

  const exportSimCSV = () => {
    const header = 'Player,Win%,Top5%,Top10%,Top20%,MadeCut%,AvgPts'
    const rows   = playerSims.map(p => `${p.name},${p.winPct},${p.top5Pct},${p.top10Pct},${p.top20Pct},${p.cutPct},${p.avgPts}`)
    const csv    = [header, ...rows].join('\n')
    const blob   = new Blob([csv], { type: 'text/csv' })
    const url    = URL.createObjectURL(blob)
    const a      = document.createElement('a')
    a.href = url; a.download = 'pgasharp_sims.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const { sorted: sortedSims, sortKey, sortDir, toggle } = useSort(playerSims, 'winPct')
  const simsReady = playerSims.length > 0
  const cols = [
    col('Player',  'name',     sortKey, sortDir, toggle),
    col('Win%',    'winPct',   sortKey, sortDir, toggle),
    col('Top 5%',  'top5Pct',  sortKey, sortDir, toggle),
    col('Top 10%', 'top10Pct', sortKey, sortDir, toggle),
    col('Top 20%', 'top20Pct', sortKey, sortDir, toggle),
    col('Cut%',    'cutPct',   sortKey, sortDir, toggle),
    col('Avg Pts', 'avgPts',   sortKey, sortDir, toggle),
  ]

  const lastRunStr = lastRun
    ? `Last simulated: ${lastRun.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Last simulated: never'

  return (
    <div>
<PageHeader title="Simulation Lab" sub="Monte Carlo simulations powered by PGASharp's proprietary composite model · Blends SG skill, DataGolf win probability, recent form & course fit" />      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
        {[['player', '📊 Player Distributions'], ['lineup', '📋 Lineup Evaluator']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveView(id)} style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: activeView === id ? 'var(--green)' : 'transparent', color: activeView === id ? 'white' : 'var(--muted)', transition: 'all 0.15s' }}>{label}</button>
        ))}
      </div>

      {activeView === 'player' && (
        <div>
          {/* Controls */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Simulations:</span>
              {[1000, 2000, 5000, 10000].map(n => (
                <button key={n} onClick={() => setSimCount(n)} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', borderRadius: 6, border: '1px solid var(--border)', background: simCount === n ? 'var(--green)' : 'white', color: simCount === n ? 'white' : 'var(--muted)', transition: 'all 0.15s' }}>{n.toLocaleString()}</button>
              ))}
              <button onClick={runPlayerSims} disabled={simRunning} style={{ padding: '8px 22px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: simRunning ? 'not-allowed' : 'pointer', opacity: simRunning ? 0.7 : 1, marginLeft: 4 }}>
                {simRunning ? `⏳ Simulating... ${progress}%` : `🎲 Run ${simCount.toLocaleString()} Sims`}
              </button>
              {simsReady && <button onClick={exportSimCSV} style={{ padding: '8px 16px', background: 'white', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>⬇ Export CSV</button>}
            </div>
            {simRunning && (
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'var(--green)', borderRadius: 4, transition: 'width 0.2s' }} />
                </div>
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
              {lastRunStr} {simsReady && `· ${simCount.toLocaleString()} simulations completed · Generates finish distributions for every player in the field`}
            </div>
          </div>

          {/* Results */}
          {simsReady ? (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <StatCard label="Players Simulated" value={playerSims.length} sub={`${simCount.toLocaleString()} runs`} type="green" />
                <StatCard label="Sim Leader" value={playerSims[0]?.name.split(' ').slice(-1)[0]} sub={`${playerSims[0]?.winPct}% win probability`} type="gold" />
                <StatCard label="Avg Winning Score" value={playerSims[0] ? `${playerSims[0].avgPts} pts` : '—'} sub="Top sim scorer" type="green" />
              </div>
              <Card>
                <SortableTable columns={cols} rows={sortedSims.map(p => [
                  <PlayerName name={p.name} country={p.country} />,
                  <SimPctBadge val={p.winPct.toFixed(1)}   thresholds={[5, 2]} />,
                  <SimPctBadge val={p.top5Pct.toFixed(1)}  thresholds={[20, 10]} />,
                  <SimPctBadge val={p.top10Pct.toFixed(1)} thresholds={[35, 20]} />,
                  <SimPctBadge val={p.top20Pct.toFixed(1)} thresholds={[50, 30]} />,
                  <SimPctBadge val={p.cutPct.toFixed(1)}   thresholds={[75, 55]} />,
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text)' }}>{p.avgPts.toFixed(1)}</span>,
                ])} />
              </Card>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--muted)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎲</div>
              <div style={{ fontWeight: 700, color: 'var(--heading)', marginBottom: 6 }}>No simulations run yet</div>
              <div>Run simulations above to see finish distributions and win probabilities for every player in the field.</div>
            </div>
          )}
        </div>
      )}

{activeView === 'lineup' && (
        <div>
          <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 4 }}>How this works</div>
            <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>
              Run tournament simulations on the <strong>Player Distributions</strong> tab first (recommended: 5,000–10,000 sims). Then paste your lineups below to see how they perform against the simulated field.
            </div>
          </div>
          {!simsReady && (
            <div style={{ background: 'var(--gold-light)', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>No simulations run yet</div>
                <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 2 }}>Switch to Player Distributions and run at least 1,000 simulations before evaluating lineups.</div>
              </div>
            </div>
          )}
          <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>Paste lineups — one per line, 6 player names comma-separated. Or upload a CSV file.</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
              📎 Upload CSV
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  const text = ev.target.result
                  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l)
                  // Skip header row if it contains G,G,G,G,G,G or non-player text
                  const dataLines = lines.filter(l => !l.match(/^[Gg],[Gg],[Gg]/))
                  setLineupText(dataLines.join('\n'))
                }
                reader.readAsText(file)
                e.target.value = ''
              }} />
            </label>
            {lineupText && <button onClick={() => setLineupText('')} style={{ padding: '7px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer' }}>✕ Clear</button>}
          </div>
          <textarea
            value={lineupText}
            onChange={e => setLineupText(e.target.value)}
            placeholder={"Robert MacIntyre, Ludvig Aberg, Si Woo Kim, Jordan Spieth, Rickie Fowler, Hideki Matsuyama\nAnother lineup here..."}
            style={{ width: '100%', minHeight: 120, padding: '12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)', background: 'var(--surface)', resize: 'vertical', boxSizing: 'border-box', marginBottom: 4, outline: 'none', spellCheck: false }}
          />
          {(() => {
            const lines   = lineupText.trim().split('\n').filter(l => l.trim())
            const parsed  = lines.map(line => line.split(',').map(n => n.trim()).filter(Boolean))
            const invalid = parsed.map(lineup => lineup.filter(name => !players.find(p => p.name === name)))
            const hasInvalid = invalid.some(l => l.length > 0)
            return hasInvalid ? (
              <div style={{ fontSize: 11, color: 'var(--red)', marginBottom: 8, fontWeight: 600 }}>
                ⚠ Unrecognized names: {invalid.flat().join(', ')}
              </div>
            ) : lines.length > 0 ? (
              <div style={{ fontSize: 11, color: 'var(--green)', marginBottom: 8, fontWeight: 600 }}>✓ {lines.length} lineup{lines.length > 1 ? 's' : ''} ready</div>
            ) : null
          })()}
          <button
            onClick={evaluateLineups}
            disabled={simRunning || !simsReady || !lineupText.trim()}
            style={{ padding: '8px 22px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: (!simsReady || !lineupText.trim()) ? 'not-allowed' : 'pointer', opacity: (!simsReady || !lineupText.trim()) ? 0.5 : 1, marginBottom: 20 }}
          >
            📋 Analyze Lineups
          </button>
          {simsReady && lineupResults && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, fontWeight: 500, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
              📊 Results based on <strong>{simCount.toLocaleString()}</strong> Monte Carlo simulations · {lastRunStr} · Player win % reflects tournament-wide finish distributions
            </div>
          )}
          {lineupResults ? lineupResults.map((r, i) => {
            const overCap   = r.salary > 50000
            const cashColor = parseFloat(r.cashRate) >= 50 ? 'var(--green)' : parseFloat(r.cashRate) >= 35 ? 'var(--gold)' : 'var(--red)'
            const copyLineup = () => navigator.clipboard.writeText(r.lineup.join(', '))
            return (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--heading)' }}>Lineup {i + 1}</div>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: overCap ? 'var(--red)' : 'var(--green)', background: overCap ? 'var(--red-light)' : 'var(--green-light)', border: `1px solid ${overCap ? '#fecaca' : 'var(--green-mid)'}`, padding: '2px 10px', borderRadius: 20 }}>
                      ${r.salary.toLocaleString()} {overCap ? '⚠ OVER CAP' : '✓'}
                    </span>
                  </div>
                  <button onClick={copyLineup} style={{ padding: '5px 12px', background: 'white', border: '1px solid var(--border)', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>📋 Copy</button>
                </div>
                <div style={{ display: 'flex', gap: 20, marginBottom: 14, flexWrap: 'wrap' }}>
                  {[
                    ['Cash Rate',  r.cashRate + '%',  cashColor,       'Top 50% of simulated lineups'],
                    ['Win Rate',   r.winRate  + '%',  'var(--green)',   'Best score in simulation'],
                    ['Avg Score',  r.avgScore + ' pts', 'var(--text)', 'Average projected DK score'],
                  ].map(([label, val, color, hint]) => (
                    <div key={label} title={hint}>
                      <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.lineup.map((name, j) => {
                    const sim = playerSims.find(p => p.name === name)
                    const winNum = parseFloat(sim?.winPct || 0)
                    const tagColor  = winNum >= 5 ? 'var(--green-dark)' : winNum >= 2 ? 'var(--gold)' : 'var(--muted)'
                    const tagBg     = winNum >= 5 ? 'var(--green-light)' : winNum >= 2 ? 'var(--gold-light)' : 'var(--bg)'
                    const tagBorder = winNum >= 5 ? 'var(--green-mid)' : winNum >= 2 ? '#fde68a' : 'var(--border)'
                    return (
                      <span key={j} title={sim ? `${name} wins the tournament in ${sim.winPct}% of simulations` : 'Player not found in sim results'} style={{ background: tagBg, border: `1px solid ${tagBorder}`, borderRadius: 6, padding: '5px 12px', fontSize: 11, color: tagColor, fontWeight: 600, cursor: 'help' }}>
                        {name}{sim ? ` · ${sim.winPct}%` : ''}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          }) : simsReady ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', fontSize: 14 }}>Paste lineups above and click Analyze to see projected cash rate and win rate.</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
function Optimizer({ players }) {
  const [locked,   setLocked]   = useState([])
  const [excluded, setExcluded] = useState([])
  const [result,      setResult]      = useState(null)
  const [multiResult, setMultiResult] = useState([])
  const [numLineups,  setNumLineups]  = useState(10)
  const [activeTab,   setActiveTab]   = useState(0)
  const [mode,        setMode]        = useState('single')
  const [running,     setRunning]     = useState(false)
  const [optoMap,     setOptoMap]     = useState({})
  const [simRunning,  setSimRunning]  = useState(false)
  const [simCount,    setSimCount]    = useState(1000)
  const withOpto = players.map(p => ({ ...p, optoPct: parseFloat(optoMap[p.name] || 0) }))
  const { sorted, sortKey, sortDir, toggle } = useSort(withOpto, 'projPoints')
  const CAP = 50000
  const toggleLock    = (name) => { setExcluded(e => e.filter(n => n !== name)); setLocked(l => l.includes(name) ? l.filter(n => n !== name) : [...l, name]); setResult(null) }
  const toggleExclude = (name) => { setLocked(l => l.filter(n => n !== name)); setExcluded(e => e.includes(name) ? e.filter(n => n !== name) : [...e, name]); setResult(null) }
  const reset = () => { setLocked([]); setExcluded([]); setResult(null); setMultiResult([]); setActiveTab(0) }

  const generateMultiLineups = () => {
    setRunning(true)
    setTimeout(() => {
      const lineups      = []
      const playerCounts = {}
      const usedKeys     = new Set()
      const maxExposure  = Math.ceil(numLineups * 0.65)
      let   attempts     = 0
      const maxAttempts  = numLineups * 20

      while (lineups.length < numLineups && attempts < maxAttempts) {
        attempts++
        const exposureCapped = Object.keys(playerCounts).filter(n => playerCounts[n] >= maxExposure)
        const tempExcluded   = [...new Set([...excluded, ...exposureCapped])]

        // Add random noise (±8%) to projections so each run explores differently
        const noisyPlayers = players.map(p => ({
          ...p,
          projPoints: p.projPoints * (0.92 + Math.random() * 0.16)
        }))

        const lineup = optimizeLineup(noisyPlayers, CAP, 6, locked, tempExcluded)
        if (!lineup || lineup.length < 6) continue

        // Re-attach real projPoints for display
        const realLineup = lineup.map(p => players.find(r => r.name === p.name) || p)
        const key = realLineup.map(p => p.name).sort().join('|')
        if (usedKeys.has(key)) continue

        usedKeys.add(key)
        lineups.push(realLineup)
        realLineup.forEach(p => { playerCounts[p.name] = (playerCounts[p.name] || 0) + 1 })
      }

      setMultiResult(lineups)
      setActiveTab(0)
      setRunning(false)
    }, 50)
  }
  const runSimulations = () => {
    setSimRunning(true)
    setTimeout(() => {
      const counts = {}
      for (let i = 0; i < simCount; i++) {
        const noisyPlayers = players.map(p => ({
          ...p,
          projPoints: p.projPoints * (0.85 + Math.random() * 0.30)
        }))
        const lineup = optimizeLineup(noisyPlayers, CAP, 6, locked, excluded)
        if (!lineup || lineup.length < 6) continue
        lineup.forEach(p => { counts[p.name] = (counts[p.name] || 0) + 1 })
      }
      const pct = {}
      Object.keys(counts).forEach(name => { pct[name] = ((counts[name] / simCount) * 100).toFixed(1) })
      setOptoMap(pct)
      setSimRunning(false)
    }, 50)
  }
  const run = () => {
    setRunning(true)
    setTimeout(() => { setResult(optimizeLineup(players, CAP, 6, locked, excluded)); setRunning(false) }, 50)
  }
  const resultSalary = result?.reduce((s, p) => s + p.salary, 0) || 0
  const resultPts    = result?.reduce((s, p) => s + p.projPoints, 0) || 0
  const cols = [
    col('Player',      'name',       sortKey, sortDir, toggle),
    col('Salary',      'salary',     sortKey, sortDir, toggle),
    col('Proj Points', 'projPoints', sortKey, sortDir, toggle),
    col('Value',       'value',      sortKey, sortDir, toggle),
    col('Opto%',       'optoPct',    sortKey, sortDir, toggle),
    { label: 'Lock' }, { label: 'Exclude' },
  ]
  const exportCSV = (lineups) => {
    const header = 'G,G,G,G,G,G'
    const rows   = lineups.map(l => l.map(p => p.name).join(','))
    const csv    = [header, ...rows].join('\n')
    const blob   = new Blob([csv], { type: 'text/csv' })
    const url    = URL.createObjectURL(blob)
    const a      = document.createElement('a')
    a.href       = url
    a.download   = 'draftkings_lineups.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div>
      <PageHeader title="DFS Optimizer" sub="Finds the highest projected 6-player lineup under the $50k DraftKings cap" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Locked In" value={locked.length} sub={`$${players.filter(p => locked.includes(p.name)).reduce((s,p) => s+p.salary,0).toLocaleString()} used`} type="green" />
        <StatCard label="Excluded" value={excluded.length} sub="Removed from pool" type="red" />
        <StatCard label="Pool Size" value={players.length - excluded.length} sub="Available players" type="gold" />
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {['single', 'multi'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: mode === m ? 'var(--green)' : 'transparent', color: mode === m ? 'white' : 'var(--muted)', transition: 'all 0.15s' }}>
              {m === 'single' ? 'Single Lineup' : 'Multi Lineup'}
            </button>
          ))}
        </div>
        {mode === 'multi' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Lineups:</span>
            <input
              type="number" min={1} max={150} value={numLineups}
              onChange={e => setNumLineups(Math.max(1, Math.min(150, parseInt(e.target.value) || 1)))}
              onKeyDown={e => e.key === 'Enter' && generateMultiLineups()}
              style={{ width: 70, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--heading)', background: 'white', textAlign: 'center' }}
            />
          </div>
        )}
        <button onClick={() => mode === 'single' ? run() : generateMultiLineups()} disabled={running} style={{ padding: '8px 22px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.7 : 1 }}>
          {running ? 'Running...' : mode === 'single' ? '⚡ Optimize' : `⚡ Generate ${numLineups} Lineups`}
        </button>
        <button onClick={runSimulations} disabled={simRunning} style={{ padding: '8px 18px', background: 'white', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: simRunning ? 'not-allowed' : 'pointer', opacity: simRunning ? 0.7 : 1 }}>
          {simRunning ? 'Simulating...' : `🎲 Run ${simCount} Sims`}
        </button>
        {(result || multiResult.length > 0) && (
          <button onClick={reset} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>Reset</button>
        )}
      </div>
{mode === 'multi' && multiResult.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {multiResult.map((_, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: activeTab === i ? 'var(--green)' : 'white', color: activeTab === i ? 'white' : 'var(--muted)', transition: 'all 0.15s' }}>
                L{i + 1}
              </button>
            ))}
          </div>
          {(() => {
            const lineup = multiResult[activeTab]
            const sal    = lineup.reduce((s, p) => s + p.salary, 0)
            const pts    = lineup.reduce((s, p) => s + p.projPoints, 0)
            return (
              <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    Salary: <strong style={{ color: 'var(--gold)' }}>${sal.toLocaleString()}</strong>
                    &nbsp;·&nbsp;Remaining: <strong>${(CAP - sal).toLocaleString()}</strong>
                    &nbsp;·&nbsp;Proj Pts: <strong style={{ color: 'var(--green)' }}>{pts.toFixed(1)}</strong>
                  </div>
                  <button onClick={() => exportCSV(multiResult)} style={{ padding: '7px 16px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>⬇ Export All to CSV</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {lineup.map((p, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--green-mid)' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--heading)', marginBottom: 6 }}><PlayerName name={p.name} country={p.country} /></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600 }}>${p.salary.toLocaleString()}</span>
                        <span style={{ background: 'var(--green-light)', color: 'var(--green-dark)', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{p.projPoints} pts</span>
                      </div>
                      {locked.includes(p.name) && <div style={{ fontSize: 10, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>🔒 LOCKED</div>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}
      {result && result.length === 6 && (
        <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)' }}>✅ Optimal Lineup Found</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                Total Salary: <strong style={{ color: 'var(--gold)' }}>${resultSalary.toLocaleString()}</strong>
                &nbsp;·&nbsp;Remaining: <strong>${(CAP - resultSalary).toLocaleString()}</strong>
                &nbsp;·&nbsp;Proj Points: <strong style={{ color: 'var(--green)' }}>{resultPts.toFixed(1)}</strong>
              </div>
            </div>
            <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Reset</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {result.map((p, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--green-mid)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--heading)', marginBottom: 6 }}><PlayerName name={p.name} country={p.country} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600 }}>${p.salary.toLocaleString()}</span>
                  <span style={{ background: 'var(--green-light)', color: 'var(--green-dark)', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{p.projPoints} pts</span>
                </div>
                {locked.includes(p.name) && <div style={{ fontSize: 10, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>🔒 LOCKED</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {result && result.length < 6 && <ErrorBox message="Couldn't build a valid lineup — try removing locked players or reducing exclusions." />}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={run} disabled={running} style={{
          background: running ? 'var(--muted)' : 'var(--green)', color: 'white',
          border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14,
          fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer', transition: 'all 0.15s'
        }}>{running ? '⏳ Optimizing...' : '⚡ Generate Optimal Lineup'}</button>
        {(locked.length > 0 || excluded.length > 0) && (
          <button onClick={reset} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>Clear All</button>
        )}
      </div>
      <Card>
        <SortableTable columns={cols} rows={sorted.map(p => {
          const isLocked = locked.includes(p.name), isExcluded = excluded.includes(p.name)
          const inResult = result?.some(r => r.name === p.name)
          return [
            <span style={{ textDecoration: isExcluded ? 'line-through' : 'none', opacity: isExcluded ? 0.4 : 1 }}>{inResult && '✓ '}<PlayerName name={p.name} country={p.country} /></span>,
            <span style={{ color: isExcluded ? 'var(--muted)' : 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, opacity: isExcluded ? 0.4 : 1 }}>${p.salary.toLocaleString()}</span>,
            <ProjBadge val={p.projPoints} />,
            <ValueBadge val={p.value} />,
            <div style={{ position: 'relative', display: 'inline-block' }} className="opto-cell">
              <span style={{
                display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                background: p.optoPct >= 50 ? 'var(--green-light)' : p.optoPct >= 20 ? 'var(--gold-light)' : 'var(--bg)',
                color:      p.optoPct >= 50 ? 'var(--green)'       : p.optoPct >= 20 ? 'var(--gold)'       : 'var(--muted)',
                border:     `1px solid ${p.optoPct >= 50 ? 'var(--green-mid)' : p.optoPct >= 20 ? '#fde68a' : 'var(--border)'}`,
                cursor: 'help'
              }}
                title="Estimated % of simulations where this player appears in the optimal lineup (based on 1,000 Monte Carlo runs using DataGolf projections)"
              >
                {p.optoPct > 0 ? `${p.optoPct}%` : '—'}
              </span>
            </div>,
            <button onClick={() => toggleLock(p.name)} style={{ background: isLocked ? 'var(--green)' : 'var(--bg)', color: isLocked ? 'white' : 'var(--muted)', border: `1px solid ${isLocked ? 'var(--green)' : 'var(--border)'}`, padding: '4px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{isLocked ? '🔒 Locked' : 'Lock'}</button>,
            <button onClick={() => toggleExclude(p.name)} style={{ background: isExcluded ? 'var(--red-light)' : 'var(--bg)', color: isExcluded ? 'var(--red)' : 'var(--muted)', border: `1px solid ${isExcluded ? '#fecaca' : 'var(--border)'}`, padding: '4px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{isExcluded ? '✕ Out' : 'Exclude'}</button>,
          ]
        })} />
      </Card>
    </div>
  )
}

function WeatherImpact({ weatherData, tournament }) {
  const [activeDay, setActiveDay] = useState(0)
  const { daily, hourlyByDay } = weatherData
  const condColor = (c) => c === 'Calm' ? 'var(--green)' : c === 'Breezy' ? 'var(--gold)' : c === 'Rainy' ? 'var(--gold)' : 'var(--red)'
  const condBg    = (c) => c === 'Calm' ? 'var(--green-light)' : c === 'Breezy' ? 'var(--gold-light)' : c === 'Rainy' ? 'var(--gold-light)' : 'var(--red-light)'
  const windiest  = daily.length > 0 ? daily.reduce((a, b) => b.gusts > a.gusts ? b : a, daily[0]) : null
  const calmest   = daily.length > 0 ? daily.reduce((a, b) => b.gusts < a.gusts ? b : a, daily[0]) : null
  const activeDate   = daily[activeDay]?.date
  const hourlyForDay = hourlyByDay[activeDate] || []
  const windColor = (w) => w >= 25 ? 'var(--red)' : w >= 15 ? 'var(--gold)' : 'var(--green)'

  if (daily.length === 0) return (
    <div>
      <PageHeader title="Tournament Weather" sub={`Live forecast for ${tournament.course} · ${tournament.dates}`} />
      <ErrorBox message="Weather data unavailable for this tournament. Check back closer to the event." />
    </div>
  )

  return (
    <div>
      <PageHeader title="Tournament Weather" sub={`Live forecast for ${tournament.course} · ${tournament.dates}`} />
      
      <Card>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--heading)' }}>Round-by-Round Summary</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{tournament.name} · {tournament.course}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${daily.length}, 1fr)` }}>
          {daily.map((w, i) => (
            <div key={i} onClick={() => setActiveDay(i)} style={{ padding: '18px 16px', borderRight: i < daily.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', background: activeDay === i ? '#f0fdf4' : 'transparent', transition: 'background 0.15s' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{w.round}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 10 }}>{w.date}</div>
              <span style={{ background: condBg(w.conditions), color: condColor(w.conditions), padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{w.conditions}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
                {[['Avg Wind', `${w.wind} mph`], ['Avg Gusts', `${w.gusts} mph`], ['Rain', `${w.rain}%`], ['High', `${w.temp}°F`]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--muted)' }}>{l}</span>
                    <span style={{ fontWeight: 600, color: l === 'Gusts' && w.gusts > 28 ? 'var(--red)' : 'var(--heading)', fontFamily: 'JetBrains Mono, monospace' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: condColor(w.conditions), fontStyle: 'italic' }}>{w.outlook}</div>
              {activeDay === i && <div style={{ marginTop: 8, fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>▼ Hourly below</div>}
            </div>
          ))}
        </div>
      </Card>
      {hourlyForDay.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--heading)', marginBottom: 12 }}>Hourly Forecast — {daily[activeDay]?.round} · {activeDate}</div>
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                  {['Time', 'Conditions', 'Temp', 'Wind', 'Gusts', 'Rain %'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hourlyForDay.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '11px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: 'var(--heading)' }}>{h.time}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--muted)' }}>{h.desc}</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--heading)' }}>{h.temp}°F</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: windColor(h.wind), fontWeight: 600 }}>{h.wind} mph</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: windColor(h.gusts), fontWeight: h.gusts >= 25 ? 700 : 400 }}>{h.gusts} mph</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ background: h.rain >= 40 ? 'var(--gold-light)' : 'transparent', color: h.rain >= 40 ? 'var(--gold)' : 'var(--muted)', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: h.rain >= 40 ? 600 : 400 }}>{h.rain}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  )
}

function CutProbability({ players }) {
  const { sorted, sortKey, sortDir, toggle } = useSort(players, 'cutProb')
  const cols = [
    col('Player',      'name',       sortKey, sortDir, toggle),
    col('Make Cut',    'cutProb',    sortKey, sortDir, toggle),
    col('Win %',       'winProb',    sortKey, sortDir, toggle),
    col('Top 5 %',     'top5Prob',   sortKey, sortDir, toggle),
    col('Top 10 %',    'top10Prob',  sortKey, sortDir, toggle),
  ]
  return (
    <div>
      <PageHeader title="Cut Probability" sub="Real pre-tournament predictions from DataGolf" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Most Likely to Cut" value={sorted[0]?.name.split(' ')[1] || '—'} sub={`${sorted[0]?.cutProb}% probability`} type="green" />
        <StatCard label="Safe Plays (75%+)" value={players.filter(p => p.cutProb >= 75).length} sub="High confidence" type="green" />
        <StatCard label="Risky Plays" value={players.filter(p => p.cutProb < 50).length} sub="Below 50% cut prob" type="red" />
      </div>
      <Card>
        <SortableTable columns={cols} rows={sorted.map(p => {
          const isSafe = p.cutProb >= 75, isMid = p.cutProb >= 55
          const color  = isSafe ? 'var(--green-dark)' : isMid ? 'var(--gold)' : 'var(--red)'
          return [
            <PlayerName name={p.name} country={p.country} />,
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 70, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${p.cutProb}%`, height: '100%', background: color, borderRadius: 99 }} />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600, color }}>{p.cutProb}%</span>
            </div>,
            <PctBadge val={p.winProb} />,
            <PctBadge val={p.top5Prob} />,
            <PctBadge val={p.top10Prob} />,
            
          ]
        })} />
      </Card>
    </div>
  )
}

function StatDeepDive({ players }) {
  const { sorted, sortKey, sortDir, toggle } = useSort(players, 'sgTotal')
  const cols = [
    col('Player',      'name',       sortKey, sortDir, toggle),
    col('SG Total',    'sgTotal',    sortKey, sortDir, toggle),
    col('SG Off Tee',  'sgOtt',      sortKey, sortDir, toggle),
    col('SG Approach', 'sgApp',      sortKey, sortDir, toggle),
    col('SG Around',   'sgArg',      sortKey, sortDir, toggle),
    col('SG Putting',  'sgPutt',     sortKey, sortDir, toggle),
    
  ]
const sgBar = (val, max, min) => {
    if (val === null) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
    const range = (max - min) || 1
    const pct   = Math.min(Math.max(((val - min) / range) * 100, 0), 100)
    const color = pct >= 66 ? 'var(--green)' : pct >= 33 ? 'var(--gold)' : 'var(--red)'
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 50, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600, color }}>{val > 0 ? '+' : ''}{val}</span>
      </div>
    )
  }
  const validSg = [...players].filter(p => p.sgTotal !== null)
  const validPlayers = sorted.filter(p => p.sgTotal !== null)
  const sgMins = {
    sgTotal: Math.min(...validPlayers.map(p => p.sgTotal)),
    sgOtt:   Math.min(...validPlayers.map(p => p.sgOtt)),
    sgApp:   Math.min(...validPlayers.map(p => p.sgApp)),
    sgArg:   Math.min(...validPlayers.map(p => p.sgArg)),
    sgPutt:  Math.min(...validPlayers.map(p => p.sgPutt)),
  }
  const sgMaxs = {
    sgTotal: Math.max(...validPlayers.map(p => p.sgTotal)),
    sgOtt:   Math.max(...validPlayers.map(p => p.sgOtt)),
    sgApp:   Math.max(...validPlayers.map(p => p.sgApp)),
    sgArg:   Math.max(...validPlayers.map(p => p.sgArg)),
    sgPutt:  Math.max(...validPlayers.map(p => p.sgPutt)),
  }
  return (
    <div>
      <PageHeader title="Field SG Stats" sub="Real strokes gained from DataGolf · Click any column to sort" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="SG Total Leader" value={[...validSg].sort((a, b) => b.sgTotal - a.sgTotal)[0]?.name.split(' ')[1] || '—'} sub="Best overall SG" type="green" />
        <StatCard label="Best Approach"   value={[...validSg].sort((a, b) => b.sgApp  - a.sgApp )[0]?.name.split(' ')[1] || '—'} sub="SG: Approach leader" type="gold" />
        <StatCard label="Best Putter"     value={[...validSg].sort((a, b) => b.sgPutt - a.sgPutt)[0]?.name.split(' ')[1] || '—'} sub="SG: Putting leader" type="green" />
      </div>
      <Card>
        <SortableTable columns={cols} rows={sorted.map(p => [
          <PlayerName name={p.name} country={p.country} />,
          sgBar(p.sgTotal, sgMaxs.sgTotal, sgMins.sgTotal),
          sgBar(p.sgOtt,   sgMaxs.sgOtt,   sgMins.sgOtt),
          sgBar(p.sgApp,   sgMaxs.sgApp,   sgMins.sgApp),
          sgBar(p.sgArg,   sgMaxs.sgArg,   sgMins.sgArg),
          sgBar(p.sgPutt,  sgMaxs.sgPutt,  sgMins.sgPutt),
        ])} />
      </Card>
    </div>
  )
}

function Leaderboard({ isLive = true }) {
  const [liveData, setLiveData]         = useState([])
  const [eventName, setEventName]       = useState('')
  const [lastUpdated, setLastUpdated]   = useState('')
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [selected, setSelected]         = useState(null)
  const [activeRound, setActiveRound]   = useState(null)
  const [roundData, setRoundData]       = useState({})
  const [roundLoading, setRoundLoading] = useState(false)
  const [espnScores, setEspnScores] = useState({})
  const [coursePar, setCoursePar] = useState({})
  const [currentRound, setCurrentRound] = useState(1)
  const sorted = [...liveData].sort((a, b) => {
    const tier = p => p.position === 'WD' || p.position === 'DQ' ? 2 : p.position === 'CUT' ? 1 : 0
    if (tier(a) !== tier(b)) return tier(a) - tier(b)
    const posNum = p => parseInt((p.position || '999').replace(/\D/g, '')) || 999
    if (posNum(a) !== posNum(b)) return posNum(a) - posNum(b)
    return a.total - b.total
  })
  const { sortKey, sortDir, toggle } = useSort(liveData, 'total', 'asc')

  useEffect(() => {
    async function fetchLive() {
      try {
        const res  = await dgFetch('preds/live-tournament-stats', { tour: 'pga', file_format: 'json' })
        const data = await res.json()
        const espnRes  = await fetch('https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard')
        const espnData = await espnRes.json()
        const espnMap  = {}
        const eventId  = espnData.events?.[0]?.id
        for (const comp of (espnData.events?.[0]?.competitions?.[0]?.competitors || [])) {
          espnMap[comp.athlete?.displayName] = comp.linescores || []
        }
        setEspnScores(espnMap)
        if (eventId) {
          const courseRes  = await fetch(`https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard?event=${eventId}`)
          const courseData = await courseRes.json()
          const holes = courseData.courses?.[0]?.holes || []
          const parMap = {}
          for (const h of holes) parMap[h.number] = h.par
          setCoursePar(parMap)
        }
        setEventName(data.event_name)
        setLastUpdated(data.last_updated)
        const allStats = data.live_stats || []
        // Detect current round by finding the highest round number players are actively playing
        const playingPlayers = allStats.filter(p => p.thru != null && p.thru > 0 && p.position !== 'CUT')
        const cutPlayers = allStats.filter(p => p.position === 'CUT')
        const hasCut = cutPlayers.length > 0
        
        let detectedRound = 1
        if (hasCut) {
          // After cut — check if R3 has started
          const r3Started = playingPlayers.some(p => p.today != null && p.round != null)
          detectedRound = r3Started ? 3 : 2
        } else {
          // Before cut — check if R2 has started
          const r2Started = allStats.some(p => p.thru != null && p.thru > 0)
          detectedRound = r2Started ? 2 : 1
        }
        setCurrentRound(Math.min(detectedRound, 4))
        const fieldRes = await dgFetch('field-updates', { tour: 'pga', file_format: 'json' })
        const fieldData = await fieldRes.json()
        const countryMap = {}
        for (const p of (fieldData.field || [])) countryMap[p.dg_id] = p.country
        
        setLiveData((data.live_stats || []).map(p => ({
          name: flipName(p.player_name), position: p.position,
          total: p.total, round: p.round, thru: p.thru,
          sgTotal: p.sg_total, sgOtt: p.sg_ott, sgApp: p.sg_app,
          sgArg: p.sg_arg, sgPutt: p.sg_putt, sgT2g: p.sg_t2g, dg_id: p.dg_id,
          country: countryMap[p.dg_id] != null ? countryMap[p.dg_id] : (PLAYER_COUNTRIES[flipName(p.player_name)] || null),
        })))
      } catch (e) { console.error(e); setError('Failed to load leaderboard. Will retry in 60s.') }
      finally { setLoading(false) }
    }
    fetchLive()
    const interval = setInterval(fetchLive, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchRound = async (roundNum) => {
    if (roundData[roundNum]) { setActiveRound(roundNum); return }
    setRoundLoading(true)
    try {
      const res  = await dgFetch('preds/live-tournament-stats', { tour: 'pga', round: roundNum, file_format: 'json' })
      const data = await res.json()
      const map  = {}
      for (const p of (data.live_stats || [])) map[p.dg_id] = p
      setRoundData(prev => ({ ...prev, [roundNum]: map }))
      setActiveRound(roundNum)
    } catch (e) { console.error(e) }
    finally { setRoundLoading(false) }
  }

  const openCard = (p) => {
    if (selected?.name === p.name) { setSelected(null); setActiveRound(null); return }
    setSelected(p); setActiveRound(null)
  }


  const scoreColor = (v) => v < 0 ? 'var(--green)' : v > 0 ? 'var(--red)' : 'var(--muted)'

const getEspnScores = (name) => {
    if (espnScores[name]) return espnScores[name]
    const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const normalized = normalize(name)
    const key = Object.keys(espnScores).find(k => normalize(k) === normalized)
    if (key) return espnScores[key]
    const last = name.split(' ').slice(-1)[0]
    const fallback = Object.keys(espnScores).find(k => normalize(k).includes(normalize(last)))
    return fallback ? espnScores[fallback] : null
  }
  const scoreStr   = (v) => v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`
  const posColor   = (pos) => pos === '1' ? '#b45309' : pos === 'T1' || pos === '2' ? 'var(--green)' : 'var(--text)'

  const headers = [
    { label: 'Pos' }, { label: 'Player', key: 'name' }, { label: 'Total', key: 'total' },
    { label: 'Today', key: 'round' }, { label: 'Thru', key: 'thru' },
    { label: 'SG Total', key: 'sgTotal' }, { label: 'SG App', key: 'sgApp' },
    { label: 'SG Putt', key: 'sgPutt' }
  ]

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />
  if (!isLive) return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <PageHeader title="Leaderboard" sub="Tournament hasn't started yet" />
      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12 }}>
        The leaderboard will go live when the tournament begins.
      </div>
    </div>
  )

  const selectedRoundStats = selected && activeRound ? roundData[activeRound]?.[selected.dg_id] : null

const ExpandedCard = ({ p }) => {
    const [activeRound, setActiveRound] = useState(0)
    const espn = getEspnScores(p.name)
    const rounds = espn ? espn.filter((r, i) => r.linescores?.length > 0 || i === 0) : []
    const isCut = p.position === 'CUT'

    const holeColor = (display) => {
      if (!display) return 'var(--text)'
      if (display === 'E') return 'var(--muted)'
      const n = parseInt(display)
      if (n <= -2) return '#b45309'
      if (n === -1) return 'var(--green)'
      if (n === 1)  return 'var(--red)'
      if (n >= 2)   return '#7c3aed'
      return 'var(--muted)'
    }
    const holeBg = (display) => {
      if (!display || display === 'E') return 'transparent'
      const n = parseInt(display)
      if (n <= -2) return '#fef3c7'
      if (n === -1) return 'var(--green-light)'
      if (n === 1)  return 'var(--red-light)'
      if (n >= 2)   return '#f5f3ff'
      return 'transparent'
    }

    const currentRound = espn?.[activeRound]
    const holes = currentRound?.linescores
      ? [...currentRound.linescores].sort((a, b) => a.period - b.period)
      : []
    const allHoles = Array.from({length: 18}, (_, i) => {
      const num = i + 1
      return holes.find(h => h.period === num) || { period: num, value: null, scoreType: null }
    })
    const front = allHoles.filter(h => h.period <= 9)
    const back  = allHoles.filter(h => h.period >= 10)
    const frontTotal = front.reduce((s, h) => s + (h.value || 0), 0)
    const backTotal  = back.reduce((s,  h) => s + (h.value || 0), 0)
    const roundTotal = currentRound?.displayValue || '—'

    return (
      <tr>
        <td colSpan={8} style={{ padding: 0, borderBottom: '2px solid var(--green-mid)' }}>
          <div style={{ background: 'var(--green-light)', padding: '16px 20px' }}>

            {/* Round tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {(isCut ? rounds.slice(0, 2) : rounds).map((r, i) => {
                const strokes = r.value || null
                const toPar   = r.displayValue || null
                const toParNum = toPar ? parseInt(toPar) : null
                const scoreColor = activeRound === i ? 'white' : toParNum < 0 ? 'var(--green)' : toParNum > 0 ? 'var(--red)' : 'var(--text)'
                return (
                  <button key={i} onClick={() => setActiveRound(i)} style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: 52,
                    background: activeRound === i ? 'var(--green)' : 'white',
                    color: activeRound === i ? 'white' : 'var(--muted)',
                    border: `1px solid ${activeRound === i ? 'var(--green)' : 'var(--border)'}`,
                    transition: 'all 0.15s'
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, opacity: 0.7 }}>R{i + 1}</span>
                    <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: scoreColor, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.1 }}>{strokes ?? '—'}</span>
                  </button>
                )
              })}
            </div>

            {holes.length > 0 ? (
              <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--green-mid)', overflow: 'hidden' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: 13, width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#e8f5ec', borderBottom: '2px solid var(--green-mid)' }}>
                      <td style={{ padding: '8px 14px', fontWeight: 700, color: 'var(--green-dark)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>HOLE</td>
                      {front.map(h => <td key={h.period} style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: 'var(--green-dark)', fontSize: 12, minWidth: 32 }}>{h.period}</td>)}
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: 'var(--green-dark)', fontSize: 11, background: '#d4edda' }}>OUT</td>
                      {back.map(h => <td key={h.period} style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: 'var(--green-dark)', fontSize: 12, minWidth: 32 }}>{h.period}</td>)}
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: 'var(--green-dark)', fontSize: 11, background: '#d4edda' }}>IN</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: 'var(--green-dark)', fontSize: 11, background: '#d4edda' }}>TOT</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: 'white' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--heading)', fontSize: 11 }}>{p.country && <span style={{ fontSize: 11 }}>{countryFlag(p.country)} </span>}{p.name.split(' ')[0]}</td>
                     {front.map(h => (
                        <td key={h.period} style={{ padding: '6px 4px', textAlign: 'center' }}>
                          {h.value != null ? (
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 26, height: 26,
                              borderRadius: h.scoreType?.displayValue <= -2 ? '50%' : h.scoreType?.displayValue === '-1' ? '50%' : '3px',
                              border: h.scoreType?.displayValue === '-1' ? `2px solid ${holeColor(h.scoreType?.displayValue)}` :
                                      h.scoreType?.displayValue === '+1' ? `2px solid ${holeColor(h.scoreType?.displayValue)}` :
                                      h.scoreType?.displayValue <= -2 ? `2px solid ${holeColor(h.scoreType?.displayValue)}` : 'none',
                              background: holeBg(h.scoreType?.displayValue),
                              color: holeColor(h.scoreType?.displayValue),
                              fontFamily: 'JetBrains Mono, monospace',
                              fontWeight: 700, fontSize: 12
                            }}>
                              {h.value}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--border)', fontSize: 12 }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ padding: '6px 8px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13, color: 'var(--heading)' }}>{frontTotal}</td>
                      {back.map(h => (
                        <td key={h.period} style={{ padding: '6px 4px', textAlign: 'center' }}>
                          {h.value != null ? (
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 26, height: 26,
                              borderRadius: h.scoreType?.displayValue <= -2 ? '50%' : h.scoreType?.displayValue === '-1' ? '50%' : '3px',
                              border: h.scoreType?.displayValue === '-1' ? `2px solid ${holeColor(h.scoreType?.displayValue)}` :
                                      h.scoreType?.displayValue === '+1' ? `2px solid ${holeColor(h.scoreType?.displayValue)}` :
                                      h.scoreType?.displayValue <= -2 ? `2px solid ${holeColor(h.scoreType?.displayValue)}` : 'none',
                              background: holeBg(h.scoreType?.displayValue),
                              color: holeColor(h.scoreType?.displayValue),
                              fontFamily: 'JetBrains Mono, monospace',
                              fontWeight: 700, fontSize: 12
                            }}>
                              {h.value}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--border)', fontSize: 12 }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ padding: '6px 8px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13, color: 'var(--heading)' }}>{backTotal}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14, color: 'var(--green-dark)' }}>{roundTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>No scorecard data available for this round.</div>
            )}

            {/* SG Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
              {[['SG Total', p.sgTotal], ['SG App', p.sgApp], ['SG Putt', p.sgPutt], ['Thru', p.thru === 18 ? 'F' : p.thru]].map(([label, val]) => {
                const color = typeof val === 'number' ? (val > 0 ? 'var(--green)' : val < 0 ? 'var(--red)' : 'var(--muted)') : 'var(--heading)'
                return (
                  <div key={label} style={{ background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--green-mid)' }}>
                    <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>
                      {typeof val === 'number' ? (val > 0 ? `+${val}` : val) : val}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div>
      <PageHeader title="Live Leaderboard" sub={`${eventName} · Updated: ${lastUpdated?.slice(0, 16)} UTC · Auto-refreshes every 60s`} />
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
              {headers.map((h, i) => (
                <th key={i} onClick={h.key ? () => toggle(h.key) : undefined} style={{
                  textAlign: 'left', padding: '11px 18px', fontSize: 11,
                  letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
                  color: sortKey === h.key ? 'var(--green)' : 'var(--muted)',
                  cursor: h.key ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap',
                }}>
                  {h.label}
                  {h.key && <span style={{ marginLeft: 5, fontSize: 9, opacity: sortKey === h.key ? 1 : 0.3 }}>{sortKey === h.key ? (sortDir === 'desc' ? '▼' : '▲') : '⬍'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const isOpen = selected?.name === p.name
              return (
                <React.Fragment key={`lb-${i}`}>
  {p.position === 'CUT' && (sorted[i - 1]?.position !== 'CUT' && sorted[i - 1]?.position !== 'WD' && sorted[i - 1]?.position !== 'DQ') && (
    <tr>
      <td colSpan={8} style={{ padding: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 18px', background: 'rgba(220,53,69,0.08)',
          borderTop: '2px solid #dc3545', borderBottom: '1px solid rgba(220,53,69,0.3)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#dc3545', letterSpacing: 1 }}>✂ CUT LINE</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(220,53,69,0.3)' }} />
        </div>
      </td>
    </tr>
  )}
                  <tr onClick={() => openCard(p)} style={{ borderBottom: isOpen ? 'none' : '1px solid var(--border)', background: isOpen ? '#f0fdf4' : 'transparent', transition: 'background 0.1s', cursor: 'pointer' }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#f0fdf4' }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}>
                    <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: posColor(p.position) }}>{p.position}</span></td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {p.country && <span style={{ fontSize: 14 }}>{countryFlag(p.country)}</span>}
                        <span style={{ color: 'var(--heading)', fontWeight: 600 }}>{p.name}</span>
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14, color: scoreColor(p.total) }}>{p.total == null ? 'E' : scoreStr(p.total)}</span></td>
                    <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: p.position === 'CUT' ? 'var(--red)' : p.round == null ? 'var(--muted)' : scoreColor(p.round) }}><span style={{ display: 'inline-block', minWidth: 32, textAlign: 'right' }}>{p.position === 'CUT' ? 'CUT' : p.round == null ? 'E' : scoreStr(p.round)}</span></span></td>
                    <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--muted)' }}>{p.thru === 18 ? 'F' : p.thru == null || p.thru === 0 ? '0' : p.thru}</span></td>
                    <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: p.sgTotal > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{p.sgTotal > 0 ? '+' : ''}{p.sgTotal}</span></td>
                    <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: p.sgApp > 0 ? 'var(--green)' : 'var(--red)' }}>{p.sgApp > 0 ? '+' : ''}{p.sgApp}</span></td>
                    <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: p.sgPutt > 0 ? 'var(--green)' : 'var(--red)' }}>{p.sgPutt > 0 ? '+' : ''}{p.sgPutt}</span></td>
  
                  </tr>
                  {isOpen && <ExpandedCard key={`card-${i}`} p={p} />}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function ModelRankings() {
  const [rankings, setRankings]       = useState([])
  const [lastUpdated, setLastUpdated] = useState('')
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [sortKey, setSortKey]         = useState('rank')
  const [sortDir, setSortDir]         = useState('asc')

  const toggle = (key) => {
    if (key === sortKey) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir(key === 'rank' ? 'asc' : 'desc') }
  }

  useEffect(() => {
    async function fetchRankings() {
      try {
        const [res, fieldRes] = await Promise.all([
          dgFetch('preds/skill-ratings', { display: 'value', file_format: 'json' }),
          dgFetch('field-updates', { tour: 'pga', file_format: 'json' }),
        ])
        const [data, fieldData] = await Promise.all([res.json(), fieldRes.json()])
        const countryMap = {}
        for (const p of (fieldData.field || [])) countryMap[p.dg_id] = p.country
        setLastUpdated(data.last_updated)
        setRankings((data.players || []).map((p, i) => ({
          rank: i + 1, name: flipName(p.player_name),
          index: parseFloat(p.sg_total.toFixed(3)), sgOtt: parseFloat(p.sg_ott.toFixed(3)),
          sgApp: parseFloat(p.sg_app.toFixed(3)), sgArg: parseFloat(p.sg_arg.toFixed(3)),
          sgPutt: parseFloat(p.sg_putt.toFixed(3)), drivingDist: parseFloat(p.driving_dist.toFixed(1)),
          dg_id: p.dg_id, country: countryMap[p.dg_id] != null ? countryMap[p.dg_id] : (PLAYER_COUNTRIES[flipName(p.player_name)] || null),
        })))
      } catch (e) { console.error(e); setError('Failed to load rankings.') }
      finally { setLoading(false) }
    }
    fetchRankings()
  }, [])

  const sorted   = [...rankings].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey]
    if (typeof av === 'string') return sortDir === 'desc' ? av.localeCompare(bv) : bv.localeCompare(av)
    return sortDir === 'desc' ? bv - av : av - bv
  })
  const maxIndex = rankings.length > 0 ? Math.max(...rankings.map(r => r.index)) : 1

  const SortTh = ({ label, k, align = 'left' }) => (
    <th onClick={() => toggle(k)} style={{
      padding: '11px 16px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
      fontWeight: 600, color: sortKey === k ? 'var(--green)' : 'var(--muted)',
      cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', textAlign: align,
    }}>
      {label}
      <span style={{ marginLeft: 4, fontSize: 9, opacity: sortKey === k ? 1 : 0.3 }}>{sortKey === k ? (sortDir === 'desc' ? '▼' : '▲') : '⬍'}</span>
    </th>
  )

  const sgCell = (val) => {
    const color = val > 0.3 ? 'var(--green)' : val > 0 ? 'var(--gold)' : 'var(--red)'
    return (
      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color }}>{val > 0 ? '+' : ''}{val}</span>
      </td>
    )
  }

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  return (
    <div>
      <PageHeader title="Model Rankings" sub={`Ranked by DataGolf strokes gained model · Updated: ${lastUpdated?.slice(0, 10)} · Click columns to sort`} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Model #1" value={rankings[0]?.name.split(' ')[1] || '—'} sub={`SG Total: +${rankings[0]?.index}`} type="green" />
        <StatCard label="Best Approach" value={[...rankings].sort((a,b) => b.sgApp - a.sgApp)[0]?.name.split(' ')[1] || '—'} sub="SG: Approach leader" type="gold" />
        <StatCard label="Best Putter"   value={[...rankings].sort((a,b) => b.sgPutt - a.sgPutt)[0]?.name.split(' ')[1] || '—'} sub="SG: Putting leader" type="green" />
        <StatCard label="Longest Driver" value={[...rankings].sort((a,b) => b.drivingDist - a.drivingDist)[0]?.name.split(' ')[1] || '—'} sub={`+${[...rankings].sort((a,b) => b.drivingDist - a.drivingDist)[0]?.drivingDist} yds avg`} type="gold" />
      </div>
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
              <SortTh label="Rank" k="rank" />
              <SortTh label="Player" k="name" />
              <th style={{ padding: '11px 16px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>SG Index</th>
              <SortTh label="SG Off Tee"  k="sgOtt"       align="right" />
              <SortTh label="SG Approach" k="sgApp"       align="right" />
              <SortTh label="SG Around"   k="sgArg"       align="right" />
              <SortTh label="SG Putting"  k="sgPutt"      align="right" />
              <SortTh label="Drv Dist"    k="drivingDist" align="right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const isTop3  = p.rank <= 3, isTop10 = p.rank <= 10
              const barPct  = Math.max(0, (p.index / maxIndex) * 100)
              const barColor = p.index > 1.5 ? '#15803d' : p.index > 1.0 ? '#16a34a' : p.index > 0.5 ? '#4ade80' : p.index > 0 ? '#bbf7d0' : 'var(--red)'
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px', width: 60 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, borderRadius: 10,
                      background: p.rank === 1 ? '#fef3c7' : isTop3 ? '#f0fdf4' : isTop10 ? 'var(--bg)' : 'transparent',
                      border: `1px solid ${p.rank === 1 ? '#fde68a' : isTop3 ? 'var(--green-mid)' : 'var(--border)'}`,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                      fontWeight: isTop10 ? 700 : 500,
                      color: p.rank === 1 ? '#b45309' : isTop3 ? 'var(--green-dark)' : isTop10 ? 'var(--heading)' : 'var(--muted)',
                    }}>{p.rank}</div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <PlayerName name={p.name} country={p.country} />
                  </td>
                  <td style={{ padding: '13px 16px', minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: p.index > 1 ? 'var(--green-dark)' : p.index > 0 ? 'var(--green)' : 'var(--muted)', minWidth: 52 }}>
                        {p.index > 0 ? '+' : ''}{p.index}
                      </span>
                      <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', maxWidth: 100 }}>
                        <div style={{ width: `${barPct}%`, height: '100%', background: barColor, borderRadius: 99 }} />
                      </div>
                    </div>
                  </td>
                  {sgCell(p.sgOtt)}{sgCell(p.sgApp)}{sgCell(p.sgArg)}{sgCell(p.sgPutt)}
                  <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: p.drivingDist > 5 ? 'var(--green)' : p.drivingDist > 0 ? 'var(--gold)' : 'var(--muted)' }}>
                      {p.drivingDist > 0 ? '+' : ''}{p.drivingDist}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function UpcomingPanel({ schedule, isMobile }) {
  const [open, setOpen] = useState(false)
  const upcoming = schedule.filter(t => t.status !== 'live')
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      {isMobile ? (
        <button onClick={() => setOpen(o => !o)} style={{
          width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 9, color: 'var(--heading)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Upcoming</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{open ? '▲' : '▼'}</span>
        </button>
      ) : (
        <button onClick={() => setOpen(o => !o)} style={{
          width: '100%', padding: '12px 16px 8px', background: 'transparent', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 9, color: 'var(--heading)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Upcoming</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{open ? '▲' : '▼'}</span>
        </button>
      )}
      {open && (
        <div style={{ padding: '0 12px 12px' }}>
          {upcoming.map(t => {
            const majorNames = ['masters', 'u.s. open', 'us open', 'open championship', 'pga championship', 'the players']
            const isMajor    = majorNames.some(m => t.name.toLowerCase().includes(m))
            return (
              <div key={t.event_id} style={{
                padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                background: isMajor ? 'var(--gold-light)' : 'transparent',
                border: isMajor ? '1px solid #fde68a' : '1px solid transparent',
                borderLeft: isMajor ? '3px solid var(--gold)' : '2px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: isMajor ? 700 : 500, color: isMajor ? 'var(--gold)' : 'var(--muted)', lineHeight: 1.3 }}>{t.name}</div>
                  {isMajor && <span style={{ background: 'var(--gold)', color: 'white', fontSize: 7, fontWeight: 700, padding: '1px 5px', borderRadius: 6, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>MAJOR</span>}
                </div>
                <div style={{ fontSize: 10, color: isMajor ? 'var(--gold)' : 'var(--muted)', opacity: 0.8, marginTop: 2 }}>{t.dates}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Settings({ user, onSignOut }) {
  return (
    <div>
      <PageHeader title="Settings" sub="Manage your account and subscription" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>

        {/* About */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>About PGASharp</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
            Real-time PGA Tour tools powered by DataGolf. Built for serious golf bettors & DFS players who want an edge.
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Data powered by <strong>DataGolf</strong></div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>·</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Weather by <strong>Open-Meteo</strong></div>
          </div>
        </div>

        {/* Account */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Account</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--heading)' }}>{user?.email}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>Signed in</div>
            </div>
            <button onClick={onSignOut} style={{
              background: 'var(--red-light)', color: 'var(--red)', border: '1px solid #fecaca',
              borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>Sign Out</button>
          </div>
        </div>

        {/* Subscription */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Subscription</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--heading)' }}>Beta Access</div>
                <span style={{ background: 'var(--green-light)', color: 'var(--green-dark)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid var(--green-mid)' }}>ACTIVE</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>Full access during beta period</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Paid plans coming soon</div>
          </div>
        </div>

        {/* Feedback */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Feedback</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Found a bug or have a feature request? Let us know.</div>
          <a href="mailto:info@pgasharp.com" style={{
            display: 'inline-block', background: 'var(--green-light)', color: 'var(--green-dark)',
            border: '1px solid var(--green-mid)', borderRadius: 8, padding: '8px 18px',
            fontSize: 13, fontWeight: 600, textDecoration: 'none'
          }}>Send Feedback</a>
        </div>

      </div>
    </div>
  )
}
function BettingOdds() {
  const [odds, setOdds]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [sort, setSort]       = useState('best')

  useEffect(() => {
    async function fetchOdds() {
      try {
        const res  = await fetch('/api/odds')
        const data = await res.json()
        if (!Array.isArray(data)) { setError('No odds available right now.'); setLoading(false); return }

        // Flatten all bookmaker odds into per-player format
        const playerMap = {}
        for (const event of data) {
          for (const bookmaker of (event.bookmakers || [])) {
            for (const market of (bookmaker.markets || [])) {
              if (market.key !== 'outrights') continue
              for (const outcome of (market.outcomes || [])) {
                const name = outcome.name
                if (!playerMap[name]) playerMap[name] = { name, books: {} }
                playerMap[name].books[bookmaker.key] = outcome.price
              }
            }
          }
        }

        // Get best odds and average odds per player
        const players = Object.values(playerMap).map(p => {
          const prices = Object.values(p.books).filter(v => typeof v === 'number')
          const best   = prices.length > 0 ? Math.max(...prices) : null
          const avg    = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null
          return { ...p, best, avg, books: p.books }
        }).filter(p => p.best !== null)

        setOdds(players)
      } catch (e) {
        setError('Failed to load odds.')
      } finally {
        setLoading(false)
      }
    }
    fetchOdds()
  }, [])

  const BOOKS = [
    { key: 'draftkings',        label: 'DraftKings' },
    { key: 'fanduel',           label: 'FanDuel' },
    { key: 'betmgm',            label: 'BetMGM' },
    { key: 'caesars',           label: 'Caesars' },
    { key: 'bet365',            label: 'Bet365' },
    { key: 'pointsbet',         label: 'PointsBet' },
    { key: 'sports_interaction', label: 'Sports Interaction' },
    { key: 'betway',            label: 'Betway' },
  ]

  const formatOdds = (val) => {
    if (val == null) return '—'
    return val > 0 ? `+${val}` : `${val}`
  }

  const oddsColor = (val) => {
    if (val == null) return 'var(--muted)'
    if (val >= 5000) return 'var(--muted)'
    if (val >= 2000) return 'var(--text)'
    if (val >= 1000) return 'var(--gold)'
    if (val >= 500)  return 'var(--green)'
    return 'var(--green-dark)'
  }

  const sorted = [...odds].sort((a, b) => {
    if (sort === 'best') return b.best - a.best
    return a.best - b.best
  })

  if (loading) return <Loading />
  if (error)   return <ErrorBox message={error} />

  const favorite = [...odds].sort((a, b) => a.best - b.best)[0]
  const longshot = [...odds].sort((a, b) => b.best - a.best)[0]

  return (
    <div>
      <PageHeader title="Betting Odds" sub="Live outright win odds across major sportsbooks · American format" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Favorite" value={favorite?.name.split(' ')[1] || '—'} sub={formatOdds(favorite?.best) + ' best odds'} type="green" />
        <StatCard label="Longest Shot" value={longshot?.name.split(' ')[1] || '—'} sub={formatOdds(longshot?.best) + ' best odds'} type="gold" />
        <StatCard label="Players Listed" value={odds.length} sub="With available odds" />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setSort('best')} style={{ background: sort === 'best' ? 'var(--green-light)' : 'var(--bg)', border: `1px solid ${sort === 'best' ? 'var(--green-mid)' : 'var(--border)'}`, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: sort === 'best' ? 'var(--green-dark)' : 'var(--muted)', cursor: 'pointer' }}>Favorites First</button>
        <button onClick={() => setSort('long')} style={{ background: sort === 'long' ? 'var(--green-light)' : 'var(--bg)', border: `1px solid ${sort === 'long' ? 'var(--green-mid)' : 'var(--border)'}`, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: sort === 'long' ? 'var(--green-dark)' : 'var(--muted)', cursor: 'pointer' }}>Longshots First</button>
      </div>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '11px 18px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Player</th>
                <th style={{ textAlign: 'left', padding: '11px 18px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--green)', fontWeight: 600 }}>Best Odds</th>
                {BOOKS.map(b => (
                  <th key={b.key} style={{ textAlign: 'center', padding: '11px 10px', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{b.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--heading)', fontSize: 14 }}><PlayerName name={p.name} country={p.country} /></td>
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>{formatOdds(p.best)}</span>
                  </td>
                  {BOOKS.map(b => (
                    <td key={b.key} style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: oddsColor(p.books[b.key]), fontWeight: p.books[b.key] === p.best ? 700 : 400 }}>
                        {formatOdds(p.books[b.key])}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ── App Shell ──────────────────────────────────────────────────────

export default function App() {
  const [showTerms, setShowTerms] = useState(false)
  const [user, setUser]           = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [page, setPageState] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return hash || 'leaderboard'
  })
  

  const setPage = (p) => {
    setPageState(p)
    setShowTerms(false)
    window.location.hash = p
  }
  const [schedule, setSchedule]                 = useState([])
  const [completedEvents, setCompletedEvents]   = useState([])
  const [activeTournament, setActiveTournament] = useState(null)
  const [players, setPlayers]                   = useState([])
  const [preTournamentPlayers, setPreTournamentPlayers] = useState([])
  const [field, setField]                       = useState([])
  const [weatherData, setWeatherData]           = useState({ daily: [], hourlyByDay: {} })
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState(null)
useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])
  useEffect(() => {
    const handlePop = () => {
      const hash = window.location.hash
      if (hash === '#home' || hash === '') setShowLanding(true)
      else if (hash === '#signin') setShowLanding(false)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])
  useEffect(() => {
    let cancelled = false
    async function load() {
      await new Promise(r => setTimeout(r, 300))
      if (cancelled) return
      try {
        const { upcoming, completed } = await fetchSchedule()
        if (cancelled) return
        setSchedule(upcoming)
        setCompletedEvents(completed)
        setActiveTournament(upcoming[0])
      } catch {
        if (!cancelled) setError('Failed to load schedule. Try refreshing.')
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!activeTournament) return
    async function load() {
      setLoading(true); setError(null); setPlayers([]); setField([]); setPreTournamentPlayers([]); setWeatherData({ daily: [], hourlyByDay: {} })
      try {
        const weather = await fetchWeather(
          activeTournament.latitude, activeTournament.longitude,
          activeTournament.start_date, activeTournament.end_date
        ).catch(() => ({ daily: [], hourlyByDay: {} }))
        setWeatherData(weather)
        setField(await fetchUpcomingField())
        // Always try DFS data — DK releases Monday before the event
        try {
          const liveData = await fetchLiveData()
          if (liveData && liveData.length > 0) {
            setPlayers(liveData)
          } else {
            setPreTournamentPlayers(await fetchPreTournamentPlayers())
          }
        } catch {
          setPreTournamentPlayers(await fetchPreTournamentPlayers())
        }
      } catch (err) {
        setError('Failed to load tournament data. Check your connection.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeTournament?.event_id])
const isLive = activeTournament?.status === 'live'
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLanding, setShowLanding] = useState(() => {
    const hash = window.location.hash
    return hash === '' || hash === '#home'
  })
  if (authLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--green-mid)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!user && showLanding) return <Landing onGetStarted={() => {
    setShowLanding(false)
    window.history.pushState(null, '', '#signin')
  }} />
  if (!user) return <Auth
    onAuth={(u) => { setUser(u); setShowLanding(false); setPageState('leaderboard'); window.history.pushState(null, '', '#leaderboard') }}
    onBack={() => { setShowLanding(true); window.history.pushState(null, '', '#home') }}
  />

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40
        }} />
      )}

      {/* Sidebar */}
      <div style={{
        width: 230, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0,
        height: '100%', minHeight: '100vh',
        overflowY: 'auto',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
        zIndex: 50,
        transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.25s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <img src="/logo.png" alt="PGASharp" style={{ width: 180, display: 'block', mixBlendMode: 'multiply' }} />
            <div style={{ marginTop: 6, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600 }}>Real-time golf data & tools</div>
            </div>
          </div>

        </div>

        {/* Nav */}
        <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
            {/* This Week */}
            <div style={{ padding: '10px 0 12px', borderBottom: '1px solid var(--border)', marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: 'var(--heading)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6, paddingLeft: 12 }}>This Week</div>
              {false ? null : (
                <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 8, padding: '9px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green-dark)', lineHeight: 1.4, flex: 1, paddingRight: 8 }}>{activeTournament?.name}</div>
                    {isLive && <span style={{ background: '#dc3545', color: 'white', fontSize: 8, fontWeight: 800, padding: '3px 7px', borderRadius: 20, letterSpacing: 1, whiteSpace: 'nowrap' }}>● LIVE</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>{activeTournament?.course?.split('(')[0].trim()}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{activeTournament?.dates}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav groups */}
            {NAV_GROUPS.map(group => (
              <div key={group.label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '4px 14px 4px', marginBottom: 2, fontWeight: 700 }}>{group.label}</div>
                {NAV.filter(n => group.ids.includes(n.id)).map(n => (
                    <button key={n.id} onClick={() => { setPage(n.id); setSidebarOpen(false) }} style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px',
                    background: page === n.id ? 'var(--green-light)' : 'transparent',
                    border: page === n.id ? '1px solid var(--green-mid)' : '1px solid transparent',
                    borderRadius: 8,
                    color: page === n.id ? 'var(--green-dark)' : 'var(--muted)',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
                    fontWeight: page === n.id ? 700 : 400, marginBottom: 2, textAlign: 'left', transition: 'all 0.12s',
                    letterSpacing: 0.1
                  }}
                    onMouseEnter={e => { if (page !== n.id) { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--heading)' } }}
                    onMouseLeave={e => { if (page !== n.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' } }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{n.icon}</span>
                    <span>{n.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

        <UpcomingPanel schedule={schedule} isMobile={isMobile} />
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <button onClick={() => { setShowTerms(true) }} style={{ background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer', padding: 0 }}>Terms of Service</button>
        </div>
      </div>

{/* Main */}
      <div style={{ marginLeft: isMobile ? 0 : 230, flex: 1, padding: isMobile ? '0' : '0' }}>

        {/* Desktop top bar */}
        {!isMobile && (
          <div style={{ padding: '12px 44px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', background: 'var(--surface)' }}>
            <button onClick={() => setPage('settings')} style={{
              background: page === 'settings' ? 'var(--green-light)' : 'var(--bg)',
              border: `1px solid ${page === 'settings' ? 'var(--green-mid)' : 'var(--border)'}`,
              borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600,
              color: page === 'settings' ? 'var(--green-dark)' : 'var(--muted)', cursor: 'pointer'
            }}>⚙️ Settings</button>
          </div>
        )}

        {/* Mobile header */}
        {isMobile && (
          <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--heading)', padding: '4px' }}>☰</button>
              <img src="/logo.png" alt="PGASharp" style={{ height: 28 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {activeTournament && (
                <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green-dark)' }}>{activeTournament.name.split(' ').slice(0, 2).join(' ')}</span>
{isLive && <span style={{ background: '#dc3545', color: 'white', fontSize: 8, fontWeight: 800, padding: '3px 7px', borderRadius: 20, letterSpacing: 1, whiteSpace: 'nowrap' }}>● LIVE</span>}                </div>
              )}
              <button onClick={() => { setPage('settings'); setSidebarOpen(false) }} style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>⚙️</button>
            </div>
          </div>
        )}

        <div style={{ padding: isMobile ? '16px 12px' : '40px 44px' }}>
          {showTerms ? <Terms onClose={() => setShowTerms(false)} /> : loading || !activeTournament ? <Loading /> : error ? (
            <ErrorBox message={error} />
          ) : (
<>
              {page === 'value'       && (players.length > 0 ? <ValueFinder   players={players} /> : <FieldPreview tournament={activeTournament} field={field} />)}
              {page === 'hot'         && <WhosHot        players={players.length > 0 ? players : preTournamentPlayers} completedEvents={completedEvents} />}
              {page === 'history'     && <CourseHistory  players={players.length > 0 ? players : field.map(p => ({...p, projPoints: 0, salary: 0, value: 0, stdDev: 0, cutProb: 50, winProb: 0, top10Prob: 0, top5Prob: 0, sgTotal: null, sgOtt: null, sgApp: null, sgArg: null, sgPutt: null, ownership: 0}))} tournament={activeTournament} />}
              {page === 'lineup'      && (players.length > 0 ? <LineupBuilder  players={players} /> : <FieldPreview tournament={activeTournament} field={field} />)}
              {page === 'own'         && (players.length > 0 ? <Ownership      players={players} /> : <FieldPreview tournament={activeTournament} field={field} />)}
              {page === 'optimizer'   && (players.length > 0 ? <Optimizer      players={players} /> : <FieldPreview tournament={activeTournament} field={field} />)}
              {page === 'weather'     && <WeatherImpact  weatherData={weatherData} tournament={activeTournament} />}
              {page === 'cut'         && <CutProbability players={players.length > 0 ? players : preTournamentPlayers} />}
              {page === 'stats'       && <StatDeepDive   players={players.length > 0 ? players : preTournamentPlayers} />}
              {page === 'odds'        && <BettingOdds />}
              {page === 'simulations' && (players.length > 0 ? <Simulations players={players} completedEvents={completedEvents} activeTournament={activeTournament} /> : preTournamentPlayers.length > 0 ? <Simulations players={preTournamentPlayers} completedEvents={completedEvents} activeTournament={activeTournament} /> : <FieldPreview tournament={activeTournament} field={field} />)}
              {page === 'leaderboard' && <Leaderboard isLive={isLive} />}
              {page === 'rankings'    && <ModelRankings />}
              {page === 'settings'    && <Settings user={user} onSignOut={() => supabase.auth.signOut()} />}
              {page === 'barpool'     && <BarPoolOptimizer players={players} isMobile={isMobile} />}
            </>

          
          )}
        </div>
        
     </div>
      {window.location.hash === '#terms' && (
        <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 100, overflowY: 'auto' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888' }}>PGASharp</div>
            <button onClick={() => { window.location.hash = '' }} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
          </div>
          <Terms />
        </div>
      )}
{user && isLive && players.length > 0 && (
        <Chat players={players} tournament={activeTournament} weatherData={weatherData} completedEvents={completedEvents} simResults={window.__simResults} />
      )}
    </div>


    
  )
}



  
