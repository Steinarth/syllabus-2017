# Grading

* Individual/Pair assignment – 75%
* Exam 25%

# Book

[Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation](https://www.amazon.com/Continuous-Delivery-Deployment-Automation-Addison-Wesley/dp/0321601912)

We will read all chapters in this book. See schedule below.

# Q&A

### Spurt og svarað

#### Um hvað snýst verkefnavinnan?

Í stuttu máli er þetta hagnýt gæðastjórnun á hugbúnaði, fyrst og fremst frá sjónarhóli forritara. Það verður komið
lítillega inn á stjórnunaraðferðir, samstarf við prófara, og hugsanlega verður eitthvað farið dýpra í nýtileikaprófanir
(usability testing). Verkefnavinna snýst að verulegu leyti um sjálfvirknivæðingu á uppsetningarferli, einingaprófanir,
sjálfvirkar viðmótsprófanir og aðferðir til að tryggja gæði í afhendingu hugbúnaðar.

#### Hvernig er fyrirkomulag námskeiðsins?

Megináherslan í námskeiðinu er á verkefnavinnu. Í lok hverrar viku eru verkefnaskil, hvert verkefni um sig gildir 25%.
Nemendur mega velja hvort þeir vinni verkefnið einir eða í pörum, ef tveir vinna saman viljum við sjá jafnt framlag frá
báðum aðilum inn á Git history. Dagarnir ganga þannig fyrir sig að við erum með fyrirlestra fyrir hádegi og eftir hádegi
geta nemendur unnið í verkefni dagsins (sem nýtist í skilaverkefni) og það verða dæmatímakennarar til aðstoðar. Við
byrjum fyrirlestrarna kl 09:00 og dæmatímarnir eru frá kl: 13:00 - 16:00.

#### Er hægt að senda fyrirspurnir Piazza ?

Nei, við verum ekki með Piazza heldur ætlum við að notast frekar við Issues hér á GitHub. Þar sem við erum líka að
hittast á hverjum degi gerum við ráð fyrir að fá flestar spurningar í dæmatímum.

#### Verða fyrirlestrar teknir upp?

Já þeir verða teknir upp, linkur á þá verður settur inn á Canvas undir Modules.

#### Hvenær lýkur námskeiðinu, þ.e., hvenær er próf?

Að öllu óbreyttu verður prófið haldið síðasta dag námskeiðsins, þ.e. 15. des og skil á síðasta verkefninu síðar þann
dag. Til að standast áfangann verða nemendur að fá yfir 4,75 á prófinu.

#### Hversu vont mál að missa úr tíma?

Efni fyrirlestranna er að finna að miklu leyti í bókinni, ættir því að geta haldið í við efnið með því að lesa
viðkomandi kafla extra-vel. Aftur á móti þá eru líka kynningar á verkefnum dagsins í tímum.

#### Hvernig er fyrirkomulagið á verkefnavinnunni, og hversu miklu álagi má búast við?

Nemendur mega velja hvort þeir vinni verkefnin sem einstaklingar eða í pörum. Það er erfitt að meta álagið nákvæmlega,
það fer verulega eftir hvaða kunnáttu menn koma með inn í kúrsinn. Við munum gera okkar besta í að halda álaginu
hóflegu, þ.e. c.a. 9-5 vinna ætti að duga flestum.

#### Þarf ég að hafa Linux uppsett á vélinni minni?

Byggt að reynslu síðustu ára mælum við með að allir nemendur séu að vinna á Linux, og þá helst Ubuntu 16.04 LTS. Það er
hægt að keyra það í sýndarumhverfi eins og t.d. VirtualBox, setja upp dual-boot, eða keyra upp á minnislykli. Einnig er
mögulegt að vinna verkefnið á Mac OsX, og munu dæmatímakennarar styðja við það. Nemendur þurfa ásamt því að vera með
góðan editor á vélinni sinni, svo sem VS Code, WebStorm, SubLime, Atom eða sambærilegt. **Æskilegt er að hafa vél með
8GB í minni, 4GB ætti að sleppa fyrir horn.** Við munum gefa út leiðbeiningar um uppsetningu síðar.

# Schedule

## Week 1

### Day 1: Mon. 27th of November

|                        | Mon                                                      | Tue                                                       | Wed                                                                           | Thu                                                | Fri                                                 |
| ---------------------- | -------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| **Lecture**            | - Introduction <br> - The Problem of Delivering Software | - Configuration Management<br> - Advanced Version Control | - The anatomy of the build pipeline <br> - Build and Deployment Scripting<br> | Deploying and Releasing Applications               | No lecture, Lab day                                 |
| **Reading Assignment** | Chapter 1                                                | Chapter 2, (3), (13), 14                                  | Chapter 5, 6                                                                  | Chapter 10, (11)                                   |                                                     |
| **Lab exercise**       | [Linux 101](/Assignment/Day1/Assignment.md)              | [Docker](/Assignment/Day2/day2.md)                        | [AWS](/Assignment/Day3/Assignment.md)                                         | [Build and Deploy](/Assignment/Day4/Assignment.md) | [Week 1 assignment](/Assignment/Day5/Assignment.md) |

## Week 2
### Day 1: Mon. 4th of December
|    | Mon | Tue | Wed | Thu | Fri |
| -- | --- | --- | --- | --- | --- |
| **Lecture** | - Implementing a Test Strategy  <br> - The Commit Stage <br> - Jenkins | - TDD Demo <br> - Event sourcing <br>- Introduce project<br> - JavaScript coding techniques <br> | - Automated Acceptance Testing<br>  | - Testing Nonfunctional Requirements <br> - Unit Testing Best Practices <br> | No lecture, Lab day |
| **Reading Assignment** | Chapter 4,7 |  | Chapter 8 | Chapter 9 |  |
| **Lab exercise** | [Jenkins](Assignment/Day6/JENKINS.md)               | - [Game logic](Assignment/Day7/tictactoe-intro.md) | - [Jenkins](Assignment/Day8/Assignment.md)   | - [Implement Game Logic and Unit Tests](Assignment/Day9/game-logic.md) | Week 2 assignment |
